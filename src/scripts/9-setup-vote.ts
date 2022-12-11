import sdk from "./1-initialize-sdk.js"

const vote = sdk.getContract("0xfDb98238B9d9b348e4294aACB6Ff5526A76b13Fc", "vote");

const token = sdk.getContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token");

(async () => {
    try {
        await (await token).roles.grant("minter", (await vote).getAddress());
        console.log("Success gave viote contract permissions to acyt on tolken contract")
    } catch (error) {
        console.error("faileds to grant vote contract permission on token contract", error);
        process.exit(1);
    }

    try {
        const ownedTokenBalanace = await (await token).balanceOf(
            process.env.WALLET_ADDRESS!
        );

        const ownedAmount = ownedTokenBalanace.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        await (await token).transfer(
            (await vote).getAddress(),
            percent90,
        );

        console.log("Success transfered " + percent90 + " token to vote contract");
    } catch (error) {
        console.error("Failed to tyarnsefar tokens to vote contract", error);
    }
})();