import admin from "firebase-admin";

const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!credentials) {
  console.log("Missing FIREBASE_SERVICE_ACCOUNT environement variable");
}

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

export type WorkspaceConfig = {
  apiKey: string;
  experienceKey: string;
  verticalKey?: string;
  clickThroughURL?: string;
};

type DocFormat = {
  token: string;
  config?: WorkspaceConfig;
};

const collectionName = "workspaces";

export const configureWorkspace = (teamId: string, config: WorkspaceConfig) => {
  return db.collection(collectionName).doc(teamId).update({ config });
};

export const setWorkspaceToken = async (teamId: string, token: string) => {
  const doc: DocFormat = { token };
  return db.collection(collectionName).doc(teamId).update(doc);
};

export const getWorkspaceDetail = async (teamId: string) => {
  const res = await db.collection(collectionName).doc(teamId).get();
  const doc = res.data() as DocFormat;
  return doc;
};

export const resetWorkspace = async (token: string, teamId: string) => {
  return db.collection(collectionName).doc(teamId).set({
    token,
  });
};
