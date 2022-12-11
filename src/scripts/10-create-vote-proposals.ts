import sdk from "./1-initialize-sdk.js"
import { ethers } from "ethers"

const vote = sdk.getContract("0xfDb98238B9d9b348e4294aACB6Ff5526A76b13Fc", "vote");

const token = sdk.getContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token");

(async () => {
    try {
        const amount = 420_000;
        const description = "Should the DAO mint an additional " + amount + " token inyto the treasury?";
        const executions = [
            {
                toAddress: (await token).getAddress(),
                nativeTokenValue: 0,
                transactionData: (await token).encoder.encode(
                    "mintTo", [
                        (await vote).getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        await (await vote).propose(description, executions);

        console.log("Successfully created proposal to mint tokens!")
    }catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 6_900;
        const description = "should the DAO transfer " + amount + " tokens from the treasury to " + 
            process.env.WALLET_ADDRESS + " for being awesome?";
        
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: (await token).encoder.encode(
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS!,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: (await token).getAddress(),
            },
        ];

        await (await vote).propose(description, executions);
        console.log("SuccessFully created  proposal to reward ourseleves from the tresury, leyt's hope people vote fopr it!")

    }catch (error) {
        console.error("Failed to create second proposal", error);
    }
})();