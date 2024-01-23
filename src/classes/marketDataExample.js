import fs from "fs/promises";

//Test file
const marketDataExample = JSON.parse(await fs.readFile("./src/json/data/marketDataExample.json", "utf-8"));

export { marketDataExample };
