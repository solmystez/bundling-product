const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login',async (req,res)=>{
    const user  = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send(
        {"message":"username or password  is wrong"}
    );

    const validPass = await bcrypt.compare(req.body.password,user.password);

    if(!validPass)return res.status(400).send(
        {"message":"username or password  is wrong"}
    );
    
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({token:token});
})

router.post('/register',async (req,res)=>{
    console.log(req.body)
    
    const userExist  = await User.findOne({username: req.body.username});
    if (userExist) return res.status(400).send({"message":"username exist"});
    
    const salt = await bcrypt.genSalt(10);
    const hashPaswd = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        username: req.body.username,
        password: hashPaswd,
        name: req.body.name
    });

    user.save()
    .then(
        (data)=>{
            return res.json(data)
        }
    ).catch(err=>{
        console.log("error!")
        return res.status(400).send({"message":"Bad Request "+err});
    });

})

module.exports = router;