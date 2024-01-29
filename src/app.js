import { jsonFromFile } from "./utils/functions/jsonFromFile.js";
import { keySelector } from "./utils/functions/keySelector.js";
import { marketData } from "./classes/marketData.js";
import { marketDataExample } from "./classes/marketDataExample.js";
import { gSheet } from "./classes/gSheet.js";

// JSON
const keySelection = await jsonFromFile("./src/json/keys/keySelection.json");
const keysArray = await jsonFromFile("./src/json/keys/keysArray.json");
const keyGoogle = await jsonFromFile("./src/json/keys/googleCloudKey.json");
const listTickers = await jsonFromFile("./src/json/data/listTickers.json");

// Functions
const keyAPIs = keySelector(keysArray, keySelection);

// Classes
const bmbSheet = new gSheet("liveMarket", keyAPIs, keyGoogle);
var marketBMB = new marketData(keyAPIs);

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
    setInterval(async () => {
        // await bmbSheet.updateSheet(marketDataExample);
        await bmbSheet.updateSheet(marketBMB.marketData);
        console.log("Update Google Sheets");
    }, 5000);
}

// Main
// startMarketData();
// startSheetGoogle();

export { marketBMB, bmbSheet, listTickers };
