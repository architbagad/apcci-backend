import argon2 from "argon2"

export const hashPassword = async (password: string, secret: string): Promise<string> => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 4,
        parallelism: 1,
        hashLength: 32,
        secret: Buffer.from(secret),
    });
}

export const verifyPassword = async (password: string, hashed: string) => {
    return await argon2.verify(hashed, password, {
        secret: Buffer.from(process.env.ARGON2_SECRET!)
    });
}