import sdk from "./1-initialize-sdk.js"
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getContract("0x0336A48c1453512083f8d5bbf18744A9bD82F683", "edition-drop");

(async () => {
    try {
        const claimConditions = [
            {
                stratTime: new Date(),
                maxQuantity: 50_000,
                price: 0,
                quantityLimitPerTransaction: 1,
                waitInSeconds: MaxUint256,
            },
        ];

        await (await editionDrop).claimConditions.set("0", claimConditions);
        console.log("Succcessfully set cliam condition!");
    }catch(error) {
        console.log("Failed to set cliam consition", error);
    }
})();
