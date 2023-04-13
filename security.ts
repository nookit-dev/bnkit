function generateEncryptionKey(): string {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return key;
}
