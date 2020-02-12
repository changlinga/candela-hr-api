const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const PUBLIC_KEY_PATH = path.join(
  __dirname,
  "../../keys",
  process.env.PUBLIC_KEY_FILE_NAME
);
const PRIVATE_KEY_PATH = path.join(
  __dirname,
  "../../keys",
  process.env.PRIVATE_KEY_FILE_NAME
);

const encryptStringWithPublicKey = textToEncrypt => {
  try {
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");
    const buffer = Buffer.from(textToEncrypt);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64");
  } catch (error) {
    throw new Error(error.message);
  }
};

const decryptBase64withPrivateKey = textToDecrypt => {
  try {
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    const buffer = Buffer.from(textToDecrypt, "base64");
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString("utf8");
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  encryptStringWithPublicKey,
  decryptBase64withPrivateKey
};
