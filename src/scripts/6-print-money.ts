import sdk from "./1-initialize-sdk.js"

const token = sdk.getContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token");

(async () => {
    try {
        const amount = 1000000;

        await (await token).mint(amount);
        const totalSupply = await (await token).totalSupply();

        console.log(
            "There now is",
            totalSupply.displayValue,
            "$LCG in circulatiuon"
        )
    } catch (error) {
        console.error("Failed to print money", error)
    }
})();