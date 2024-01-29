import fs from "fs/promises"; // Import the 'fs' module with promises
import logger from "../utils/loggers/errorLog.js";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

class gSheet {
    constructor(sheetName, keyAPIs, keyGoogle) {
        this.sheetName = sheetName;
        this.keyGoogle = keyGoogle;

        this.sheetID = keyAPIs.sheetID;
        this.serviceAccountAuth = new JWT({
            email: this.keyGoogle.client_email,
            key: this.keyGoogle.private_key,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }

    async updateSheet(marketData) {
        try {
            const doc = new GoogleSpreadsheet(this.sheetID, this.serviceAccountAuth);

            await doc.loadInfo();
            const sheet = doc.sheetsByTitle[this.sheetName];

            let array = [];
            marketData.forEach(function (data) {
                var rowData = [data.ticker.ars, data.lastPrice.ars.t48.value, data.lastPrice.usd.t48.value];
                array.push(rowData);
            });
            await sheet.clear();
            await sheet.setHeaderRow(["ticker", "priceArs48", "priceUsd48"]);
            await sheet.addRows(array);
            await sheet.saveUpdatedCells();
        } catch (error) {
            logger.error(`Error updating spreadsheet: ${error}`);
        }
    }
}

export { gSheet };
