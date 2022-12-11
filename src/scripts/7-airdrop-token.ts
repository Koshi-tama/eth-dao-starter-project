import sdk from "./1-initialize-sdk.js"

const editionDrop = sdk.getContract("0x0336A48c1453512083f8d5bbf18744A9bD82F683", "edition-drop");

const token = sdk.getContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token");

(async () => {

    try {
        const walletAddress = await (await editionDrop).history.getAllClaimerAddresses(0);

        if (walletAddress.length === 0 ) {
            console.log(
                "No NFTs have been claimed yet, maybe get some frends to claim yourv free NMFTs",
            );
            process.exit(0);
        }

        const airdropTargets = walletAddress.map((address) => {
            const randomAmounty = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("Going tob airdrop", randomAmounty, "token to", address);

            const airdropTraget = {
                toAddress: address,
                amount: randomAmounty,
            };
            
            return airdropTraget;
        });

        console.log("starting aiordrop...")
        await (await token).transferBatch(airdropTargets);
        console.log("Success airdrop tokens to all the holders of the NFT&s!")
    } catch (error) {
        console.log("Failed to airdrop tokens", error);
    }
})();


