const DB = require('../database/models');

const Authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Invalid Token" });
    }
  }
}


module.exports = {Authenticate}

