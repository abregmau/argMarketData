import fs from "fs/promises";
import logger from "../utils/loggers/errorLog.js";
import jsRofex from "rofexjs";
import { promises } from "dns";
import { checkPrimeSync } from "crypto";

class marketData {
    constructor(keyAPIs) {
        this.keyAPIs = keyAPIs;
        this.marketData = {};

        if (this.keyAPIs.environment === "DEVELOPMENT") {
            var envRofex = "reMarkets";
        } else if (this.keyAPIs.environment === "PRODUCTION") {
            var envRofex = "production";
        } else {
            var envRofex = null;
            logger.error("Undefined environment");
        }

        this.apiRofex = new jsRofex(envRofex);

        if (this.keyAPIs.environment === "PRODUCTION") {
            this.apiRofex.base_url = this.keyAPIs.url;
        }
    }

    async login() {
        return new Promise((resolve, reject) => {
            this.apiRofex.login(this.keyAPIs.user, this.keyAPIs.password, function (rta) {
                if (rta.status == "OK") {
                    console.log("Connected Successfully");
                    resolve();
                } else {
                    console.log("Error in login process");
                    console.log(rta);
                    reject("Error in login process");
                }
            });
        });
    }

    async getInstruments() {
        this.apiRofex.get_instruments("securities", true, function (data_get) {
            if (JSON.parse(data_get).status == "OK") {
                //console.log(data_get);
                fs.writeFile("./src/tests/test.json", JSON.stringify(data_get));
            } else {
                console.log("Error:");
                console.log(data_get);
            }
        });
    }

    async getMarketData(ticker, term) {
        return new Promise((resolve, reject) => {
            let tickerLong = "MERV - XMEV - " + ticker + " - " + term;
            this.apiRofex.get_market_data("ROFX", tickerLong, ["BI", "OF", "LA"], 1, (data_get) => {
                try {
                    const parsedData = JSON.parse(data_get);
                    if (parsedData.status === "OK") {
                        // console.log(data_get);
                        resolve(parsedData);
                    } else {
                        console.log("Error fetching data: " + parsedData.description);
                        reject(parsedData.description);
                    }
                } catch (error) {
                    console.log("Error parsing data: " + error);
                    console.log(typeof data_get);
                    reject(error);
                }
            });
        });
    }

    async getAllMarketData(listTickers) {
        const terms = ["CI", "24hs", "48hs"];
        const allData = [];

        for (const ticker of listTickers) {
            const data = {
                ticker: { ars: ticker.ars, usd: ticker.usd },
                lastPrice: {
                    ars: { CI: {}, t24: {}, t48: {} },
                    usd: { CI: {}, t24: {}, t48: {} },
                },
            };

            for (const t of terms) {
                try {
                    const dataARS = await this.getMarketData(ticker.ars, t);
                    const dataUSD = await this.getMarketData(ticker.usd, t);

                    const updateLastPrice = (term) => {
                        if (dataARS.marketData.LA !== null) {
                            data.lastPrice.ars[term].value = dataARS.marketData.LA.price;
                            data.lastPrice.ars[term].timestamp = dataARS.marketData.LA.date;
                        }
                        if (dataUSD.marketData.LA !== null) {
                            data.lastPrice.usd[term].value = dataUSD.marketData.LA.price;
                            data.lastPrice.usd[term].timestamp = dataUSD.marketData.LA.date;
                        }
                    };

                    if (t === "CI") {
                        updateLastPrice("CI");
                    }
                    if (t === "24hs") {
                        updateLastPrice("t24");
                    }
                    if (t === "48hs") {
                        updateLastPrice("t48");
                    }
                } catch (error) {
                    console.error(`Error fetching market data ${ticker.ars}/${ticker.usd} - ${t}:`, error);
                }

                await new Promise((resolve) => setTimeout(resolve, 50));
            }

            allData.push(data);
        }

        this.marketData = allData;
        return allData;
    }
}

export { marketData };
