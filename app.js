require('dotenv').config({path:__dirname+'/.env'})

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const usersRouter  = require('./routes/users');
const loginRouter  = require('./routes/auth');
const productsRouter  = require('./routes/products');
const bundlesRouter = require('./routes/bundles')

// app.use('/posts', ()=>{
//     console.log("post middleware")
// })
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/bundles', bundlesRouter);
app.use('/', loginRouter);

app.get('/',(req,res)=>{
    res.send('home get api')
})

app.get('/posts',(req,res)=>{
    res.send('get all post api')
})

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true})
.then(()=>console.log("callback connect db"))
.catch(err => console.log(err))
console.log(process.env.PORT)
app.listen(process.env.PORT,'localhost');