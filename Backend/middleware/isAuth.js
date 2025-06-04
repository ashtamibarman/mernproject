// backend/middleware/isAuth.js

function isAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next(); // user is authenticated
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = isAuth;
