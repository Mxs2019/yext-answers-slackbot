import geoViewport from "@mapbox/geo-viewport";
import geojsonExtent from "@mapbox/geojson-extent";
import { dividor, image, text } from "../blocks";
import { renderResult } from "./renderResult";

export const renderSection = (results: any[], title?: string) => {
  const blocks = [];

  if (title) {
    blocks.push(text(`_${title}_`));
    blocks.push(dividor());
  }

  // If lat lngs show hero map
  const latlngs = results
    .map((r) => r.data && r.data.yextDisplayCoordinate)
    .filter((c) => c);
  if (latlngs.length > 0) {
    blocks.push(image(getStaticMap(latlngs), "Map"));
    blocks.push(dividor());
  }

  results.forEach((r: any, i) => {
    blocks.push(...renderResult(r));
    blocks.push(dividor());
  });

  return blocks;
};

const getStaticMap = (
  markers: {
    latitude: number;
    longitude: number;
  }[]
) => {
  const pins = markers
    .map((m) => `pin-s-circle+ff2929(${m.longitude},${m.latitude})`)
    .join(",");

  // Declare a GeoJSON file with the two places we're interested in.
  const geo = {
    type: "FeatureCollection",
    features: markers.map((m) => {
      return {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [m.longitude, m.latitude],
        },
      };
    }),
  };

  // Calculate a bounding box in west, south, east, north order.
  const bounds = geojsonExtent(geo);

  // The size of the desired map.
  const size = [750, 400];

  // Calculate a zoom level and centerpoint for this map.
  const vp = geoViewport.viewport(bounds, size, 0, 16, 512);

  // Create pins at places in the geojson file.
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${pins}/${vp.center.join(
    ","
  )},${vp.zoom},0/${size.join(
    "x"
  )}@2x?access_token=pk.eyJ1IjoibXNoYXciLCJhIjoiY2locXNoaHFuMDAxbHcxa3N3aG5wbmdjMCJ9.uXl1VtmbCV58VR48QqEdtA`;
  return url;
};
