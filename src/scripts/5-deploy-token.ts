import { AddressZero } from "@ethersproject/constants"
import sdk from "./1-initialize-sdk.js"

(async () => {
    try {
        const tokenAddress = await sdk.deployer.deployToken({
            name: "Labo Colletiver Governance Token",
            symbol: "LCG",
            primary_sale_recipient: AddressZero,
        });
        console.log(
            "Succcess deplolyed token modulke, address:",
            tokenAddress
        );
    } catch (error) {
        console.error("failed to deploy topken moduke", error);
    }
})();
