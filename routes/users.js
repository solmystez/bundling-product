const express = require('express');
const router = express.Router();
const verified = require('./verifyToken');

const User = require('../models/User');

router.get('/',verified,async(req,res)=>{
    try{
        const users = await User.find();
        if (users.length != 0){
            res.json(users);
        }else{
            res.status(401).send( {"message":"wrong username or password"});
        }
    }catch(e){
        res.status(400).send({"message":"Bad Request"+e});
    }
})


module.exports = router;