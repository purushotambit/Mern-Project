var jwt = require('jsonwebtoken');
const JWT_SECRET="PURUSOTAM";
const fetchuser = (req, res, next) => {
    // const token = req.header('auth-token');
    try {
        const token=req.cookies.jwtoken;
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
       return res.status(500).send({ error: "Internal Server error"})
    }
}
module.exports = fetchuser;