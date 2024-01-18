import fs from "fs/promises";

const string = await fs.readFile("./src/data/marketDataExample.json", "utf-8");

const marketData = JSON.parse(string);

export { marketData };
