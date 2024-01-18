import { GoogleSpreadsheet } from "google-spreadsheet";

import { marketData } from "./src/classes/marketData.js";
import { authService } from "./src/classes/authSheet.js";

const updateSheet = async () => {
    try {
        const doc = new GoogleSpreadsheet(
            authService.sheetID,
            authService.serviceAccountAuth
        );

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // const arreglo = [];
        // for (let i = 0; i < 10; i++) {
        //     arreglo.push([i, i]);
        // }

        // //await sheet.clear();
        // await sheet.setHeaderRow(["ticker", "priceArs48", "priceUsd48"]);
        // await sheet.addRows(arreglo);

        // await sheet.saveUpdatedCells();
        let array = [];
        marketData.forEach(function (data) {
            // Construye un arreglo de valores para cada fila
            var rowData = [
                data.ticker.ars,
                data.lastPrice.ars.t48.value,
                data.lastPrice.usd.t48.value,
            ];

            // Agrega la fila a la hoja de cálculo
            array.push(rowData);
        });
        await sheet.addRows(array);
        await sheet.saveUpdatedCells();
    } catch (error) {
        console.error("Error al actualizar la hoja de cálculo:", error.message);
    }
};

updateSheet();

// console.log(marketData[0].lastPrice.ars.t48.value);
