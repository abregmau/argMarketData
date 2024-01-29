import { marketBMB, bmbSheet, listTickers } from "./app.js";

// Main
async function executeAtScheduledTime() {
    console.log("The loop is running at a specific time.");
    await marketBMB.login();
    await marketBMB.getAllMarketData(listTickers);
    await bmbSheet.updateSheet(marketBMB.marketData);
    console.log("Update Market Data");
}

async function startLoop() {
    // Set the start and end hours
    const startHour = 10;
    const startMinute = 50;
    const endHour = 17;
    const endMinute = 5;

    await executeAtScheduledTime();

    // Set the interval to run every minute
    setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Check if it's within the specified time range
        if (
            (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
            (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
        ) {
            executeAtScheduledTime();
        }
    }, 5 * 60000); // 60000 milliseconds = 1 minute
}

// Start the loop
startLoop();
