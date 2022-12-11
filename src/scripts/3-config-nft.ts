import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getContract("0x0336A48c1453512083f8d5bbf18744A9bD82F683", "edition-drop");

(async () => {
    try {
        await (await editionDrop).createBatch([
            {
                name: "Member's Limited Labo",
                description: "Laboにアクセスすることができるアイテムです。",
                image: readFileSync("src/scripts/assets/NFT.jpg"),
            },
        ]);
        console.log("successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to cerate the new NFT", error);
    }
})();
