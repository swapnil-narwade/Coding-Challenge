const {Users} = require('./Users');

let authenticate = (req, res, next)=>{
    let token = req.header('x-auth');
    Users.findByToken(token).then((user)=>{
        if (!user){
            return res.status(401).send(e);
        }
        req.user =user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send(`unauthorised user`);
    });
};

module.exports={
    authenticate
};