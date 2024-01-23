import fs from "fs/promises";

export const jsonFromFile = async (path) => {
    try {
        return JSON.parse(await fs.readFile(path, "utf-8"));
    } catch (error) {
        return "Error reading file: " + error;
    }
};
