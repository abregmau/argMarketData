import { jsonFromFile } from "./utils/functions/jsonFromFile.js";
import { marketData } from "./classes/marketData.js";
import { marketDataExample } from "./classes/marketDataExample.js";
import { gSheetONs } from "./classes/gSheetONs.js";

//Constants
const dirSheetID = "./src/json/keys/sheetID.json";
const dirSheetKey = "./src/json/keys/googleCloudKey.json";
const apiPrimaryKey = await jsonFromFile("./src/json/keys/apiPrimaryKey.json");
const listTickers = await jsonFromFile("./src/json/data/listTickers.json");

// Classes
const bmbSheetONs = new gSheetONs("liveMarket");
var marketBMB = new marketData("BMB", apiPrimaryKey);

// Logic API Primary
async function startMarketData() {
    await marketBMB.login();
    await marketBMB.getAllMarketData(listTickers);
    // marketBMB.getInstruments();

    setInterval(async () => {
        await marketBMB.getAllMarketData(listTickers);
        console.log("Update Market Data");
    }, 60000);
}

// Logic Google Sheets
async function startSheetGoogle() {
    await bmbSheetONs.readSheetID(dirSheetID);
    await bmbSheetONs.readKeyFile(dirSheetKey);
    setInterval(async () => {
        // await bmbSheetONs.updateSheet(marketDataExample);
        await bmbSheetONs.updateSheet(marketBMB.marketData);
        console.log("Update Google Sheets");
    }, 5000);
}

// Main
startMarketData();
startSheetGoogle();
