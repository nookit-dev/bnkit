type SecureHashConfig = {
  algorithm: "bcrypt";
  memoryCost?: number;
  timeCost?: number;
  cost?: number;
};

export function createSecureHashFactory() {
  const hashPassword = async (
    password: string,
    config: SecureHashConfig = {
      algorithm: "bcrypt",
    }
  ) => {
    return await Bun.password.hash(password, config);
  };

  const verifyPassword = async (password: string, hash: string) => {
    return await Bun.password.verify(password, hash);
  };

  const hashPasswordSync = (password: string, config?: SecureHashConfig) => {
    return Bun.password.hashSync(password, config);
  };

  const verifyPasswordSync = (password: string, hash: string) => {
    return Bun.password.verifySync(password, hash);
  }; 
  return {
    hashPassword,
    verifyPassword,
    hashPasswordSync,
    verifyPasswordSync,
  };
}
