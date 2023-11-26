import crypto from "crypto-js";

export const hashPassword = (username: string, password: string) => {
    const algo = crypto.algo.SHA256.create();
    algo.update(crypto.SHA256(username));
    algo.update(crypto.SHA256(password));
    algo.update(crypto.SHA256(import.meta.env.VITE_CRYPTO_SECRET_KEY_1));
    algo.update(crypto.SHA256(import.meta.env.VITE_CRYPTO_SECRET_KEY_2));
    algo.update(crypto.SHA256(import.meta.env.VITE_CRYPTO_SECRET_KEY_3));

    return algo.finalize().toString(crypto.enc.Base64);
}