const bcrypt = require("bcryptjs");

const getHashedPassword = password => {
  const newSalt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, newSalt);
};

const compareHashedPassword = (password, hashValue) => {
  return bcrypt.compareSync(password, hashValue);
};

module.exports = {
  getHashedPassword,
  compareHashedPassword
};
