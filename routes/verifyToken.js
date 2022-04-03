const jwt = require('jsonwebtoken');

module.exports= function(req,res,next){
    let token = req.header('Authorization');
    if(!token) return res.status(401).send({message:"access denied"});  

    let bearer = token.split(" ");
    token = bearer[1];

    try {
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).send({message:"invalid token"}); 
    }
}