// const jwt = require("jsonwebtoken")

// const authenticateToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) return res.json({error:"Token absent"});
  
//     jwt.verify(token, 'your-secret-key', (err, user) => {
//       if (err) return res.json({error:"Wrong token"});
//       req.user = user;
//       next();
//     });
//   };

//   module.exports = {
//     authenticateToken,
//   }