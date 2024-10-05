import { google } from "googleapis";
import client from "@/oauth_client.json";
import { convertXlsxToObjects } from "./xlsx-to-obj";

const FOLDER_ID = "1aA9y9idHtf5M9j7AKHWytzPW0wlPjm-0";

const CLIENT_ID = client.web.client_id;
const CLIENT_SECRET = client.web.client_secret;
const REFRESH_TOKEN = client.web.refresh_token;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  client.web.redirect_uris[0]
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oAuth2Client,
});

export async function listFilesInFolder() {
  try {
    const query = `'${FOLDER_ID}' in parents and mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' and trashed=false`;

    console.log("Query:", query);
    const response = await drive.files.list({
      q: query,
      fields: "files(id, name)",
    });

    console.log("wtf");

    const files = response.data.files;

    if (files && files.length > 0) {
      const dataArray = [];

      for (let i = 0; i < files.length; i++) {
        const response = await drive.files.get(
          { fileId: files[i].id || "", alt: "media" },
          { responseType: "arraybuffer" }
        );

        const data = new Uint8Array(response.data as ArrayBuffer);

        const dataObjectArray = convertXlsxToObjects(data);
        dataArray.push({ file: dataObjectArray });
      }

      return { fileData: dataArray };
    } else {
      return { fileData: [] };
    }
  } catch (error) {
    console.error("Error retrieving files:", error);
  }
}
