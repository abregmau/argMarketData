import fs from "fs/promises"; // Import the 'fs' module with promises
import { JWT } from "google-auth-library";

class authSheet {
    constructor() {}

    async readKeyFile() {
        const string = await fs.readFile(
            "./src/keys/marketData-sheetKey.json",
            "utf-8"
        );

        const auth = JSON.parse(string);

        this.serviceAccountAuth = new JWT({
            email: auth.client_email,
            key: auth.private_key,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }

    async readSheetID() {
        const string = await fs.readFile(
            "./src/keys/marketData-sheetID.json",
            "utf-8"
        );

        this.sheetID = JSON.parse(string).sheetID;
    }
}

const authService = new authSheet();
await authService.readKeyFile();
await authService.readSheetID();

export { authService };
