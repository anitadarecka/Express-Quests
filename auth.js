const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  const password = req.body.password;
  argon2
  .hash(password, hashingOptions)
  .then((hashedPassword) => {
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    next();
  })
  .catch((err) => {
    console.log(err);
    res.sensStatus(500);
  });
};

module.exports = {
  hashPassword,
};