import sdk from "./1-initialize-sdk.js"

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "My Labo DAO",
            voting_token_address: "0x4B81bee5441DA2c96ad16139e4bd26ad818b5901",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,
            proposal_token_threshold: 0,
        });

        console.log(
            "Succcessfully deployerd vote contract, address:",
            voteContractAddress
        );
    }catch (error) {
        console.error("Failed to deploy vote contract", error);
    }
})();
