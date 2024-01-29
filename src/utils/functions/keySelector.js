export const keySelector = (keysArray, keySelection) => {
    let keyAPIs = keysArray.find((key) => key.nameGroup === keySelection.group);

    return keyAPIs;
};
