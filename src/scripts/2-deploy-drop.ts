import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "Labo Token",
      description: "A DAO for labo member",
      image: readFileSync("src/scripts/assets/labo.jpg"),
      primary_sale_recipient: AddressZero,
    });

    const editionDrop = sdk.getContract(editionDropAddress, "edition-drop");

    const metadata = await (await editionDrop).metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress
    );

    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();