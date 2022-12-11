import sdk from "./1-initialize-sdk.js"

const token = sdk.getContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token");

(async () => {
    try {
        const allRoles = await (await token).roles.getAll();
        console.log("Roles that exist righht now :", allRoles);

        await (await token).roles.setAll({ admin: [], minter: [] });
        console.log(
            "Roles after revoking oversease",
            await (await token).roles.getAll()
        );

        console.log("Successfully revokerd our superpeowers from trhe ERC-20 contract");

    }catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasuryh", error);
    }
})();