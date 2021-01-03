import objectPath from "object-path";
import { button, ButtonElement, buttons, header, image, text } from "../blocks";

export const renderResult = (result: any, showPoint = false) => {
  const { data } = result;
  const blocks = [];

  const titleDecoration = showPoint ? ":point_right: " : "";
  if (data) {
    // Add Name
    blocks.push(header(`${titleDecoration}${data.name}`));

    // Find accessory Image
    const accessoryImage = objectPath.coalesce(data, [
      "photoGallery.0.image.url",
      "logo.image.url",
      "headshot.url",
    ]);
    let accessoryImageAdded = false;

    // Find all relevant blocks of text
    const textBlocks = [
      objectPath.get(data, "address")
        ? formatAddress(objectPath.get(data, "address"))
        : undefined,
      objectPath.get(data, "answer"),
      objectPath.get(data, "description"),
      objectPath.get(data, "c_answer"),
    ].filter((t) => t);

    // Add Text Blocks with accessory image in the first one
    textBlocks.forEach((t, i) => {
      // Only add first text block
      if (i === 0) {
        if (accessoryImage && !accessoryImageAdded) {
          blocks.push(
            text(formatMarkdownForSlack(t), accessoryImage, data.name)
          );
          accessoryImageAdded = true;
        } else {
          blocks.push(text(formatMarkdownForSlack(t)));
        }
      }
    });

    if (!accessoryImageAdded && accessoryImage) {
      blocks.push(image(accessoryImage, data.name));
      accessoryImageAdded = true;
    }

    // Add CTAs
    const ctas: ButtonElement[] = [];

    if (objectPath.get(data, "c_primaryCTA.url")) {
      ctas.push({
        label: objectPath.get(data, "c_primaryCTA.label"),
        value: "cta",
        url: objectPath.get(data, "c_primaryCTA.url"),
      });
    }
    if (objectPath.get(data, "c_secondaryCTA.url")) {
      ctas.push({
        label: objectPath.get(data, "c_secondaryCTA.label"),
        value: "cta",
        url: objectPath.get(data, "c_secondaryCTA.url"),
      });
    }

    conditionallyRender(data, ["landingPageUrl", "websiteUrl.url"], (url) => {
      ctas.push({
        label: "View Details",
        value: "view_website",
        url,
      });
    });

    // Get Directions
    conditionallyRender(data, ["yextDisplayCoordinate"], (c) => {
      ctas.push({
        label: ":round_pushpin: Get Directions",
        value: "get_directions",
        url: `https://www.google.com/maps/dir//${c.latitude},${c.longitude}`,
      });
    });

    // conditionallyRender(data, ["mainPhone"], (number) => {
    //   ctas.push({
    //     label: ":telephone_receiver: Call",
    //     value: "tap_to_call",
    //     url: `tel:${number}`,
    //   });
    // });

    if (ctas.length > 0) {
      blocks.push(buttons(ctas));
    }
  } else {
    conditionallyRender(result, ["title", "htmlTitle"], (title) => {
      blocks.push(header(`${titleDecoration}${title}`));

      conditionallyRender(result, ["link", "html_url"], (url) => {
        blocks.push(button("View Page", "view_page", url));
      });
    });
  }

  return blocks;
};

const conditionallyRender = (
  object: any,
  paths: string[],
  func: (value: any) => void
) => {
  const value = objectPath.coalesce(object, paths);
  if (value) func(value);
};

const formatAddress = ({
  line1,
  city,
  region,
  postalCode,
  countryCode,
}: {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}) => {
  return `${line1}\n${city}, ${region}, ${postalCode}, ${countryCode}`;
};

const formatMarkdownForSlack = (mkdwn: string) => {
  let tweakedMkdwn = mkdwn;

  //Remove Escape Dashes
  tweakedMkdwn = tweakedMkdwn.split("\\-").join("");

  //   Fix Bolding
  tweakedMkdwn = tweakedMkdwn.split("**").join("*");

  //  Fix Links
  const regex = /\+\+\[(.*)]\((.*)\)\+\+/gm;
  tweakedMkdwn = tweakedMkdwn.replace(
    regex,
    (match, label, url) => `<${url}|${label}>`
  );
  return tweakedMkdwn;
};
