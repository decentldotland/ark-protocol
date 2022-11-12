import { arweave } from "./network.js";
import { getAdminMessage } from "./exm-rwx.js";
import "../setEnv.js";

const ADMIN_JWK = JSON.parse(process.env.ADMIN_JWK);

export async function generateAdminSignature() {
    const messageBody = await getAdminMessage();
    const message = new TextEncoder().encode(`${messageBody}${ADMIN_JWK.n}`);
    const signature = await arweave.crypto.sign(ADMIN_JWK, message);

    return signature.toString("base64");
}
