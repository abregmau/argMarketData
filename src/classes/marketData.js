import fs from "fs/promises";
import logger from "../utils/loggers/errorLog.js";
import jsRofex from "rofexjs";

class marketData {
    constructor(broker, apiKey) {
        this.keyBroker = apiKey.find((item) => item.broker === broker);

        if (this.keyBroker.environment === "DEVELOPMENT") {
            var envRofex = "reMarkets";
        } else if (this.keyBroker.environment === "PRODUCTION") {
            var envRofex = "production";
        } else {
            var envRofex = null;
            logger.error("Undefined environment");
        }

        this.apiRofex = new jsRofex(envRofex);

        if (this.keyBroker.environment === "PRODUCTION") {
            this.apiRofex.base_url = this.keyBroker.url;
        }
    }

    async login() {
        return new Promise((resolve, reject) => {
            this.apiRofex.login(
                this.keyBroker.user,
                this.keyBroker.password,
                function (rta) {
                    if (rta.status == "OK") {
                        console.log("Connected Successfully");
                        resolve();
                    } else {
                        console.log("Error in login process");
                        console.log(rta);
                        reject("Error in login process");
                    }
                }
            );
        });
    }
}

// New
const apiPrimaryKey = JSON.parse(
    await fs.readFile("./src/keys/apiPrimaryKey.json", "utf-8")
);

//Test API Remarket
var marketBMB = new marketData("BMB", apiPrimaryKey);
await marketBMB.login();
console.log(marketBMB);

//Test file
const marketDataExample = JSON.parse(
    await fs.readFile("./src/data/marketDataExample.json", "utf-8")
);

export { marketBMB, marketDataExample };
