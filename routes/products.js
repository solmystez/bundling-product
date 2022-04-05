const express = require('express');
const router = express.Router();
const verified = require('./verifyToken');

const Product = require('../models/Product');

router.get('/',verified,async(req,res)=>{
    const { page = 1, limit = 10 } = req.query;
    try{
        const products = await Product.find().limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Product.countDocuments();
        
        res.json({products,
            totalPages: Math.ceil(count / limit),
            currentPage: page});

    }catch(e){
        res.status(400).send({"message":"Bad Request"+e});
    }
})

router.post('/create',verified,async (req,res)=>{
    const product = new Product({
        SKU: req.body.SKU,
        name: req.body.name,
        stock: req.body.stock,
        price: req.body.price,
        weight: req.body.weight,
        UOM: req.body.UOM
    });

    product.save()
    .then(
        (data)=>{
            return res.json(data);
        }
    ).catch(err=>{
        console.log("error!")
        return res.status(400).send({"message":"Bad Request "+err});
    });
})

router.patch('/update/:id',verified,async (req,res)=>{
    const product = Product.findById(req.params.id).then(obj =>{
        obj.SKU = req.body.SKU
        obj.name = req.body.name
        obj.stock = req.body.stock
        obj.price = req.body.price
        obj.weight = req.body.weight
        obj.UOM = req.body.UOM
        obj.save()
        .then(
            (data)=>{
                return res.json(data);
            }
        ).catch(err=>{
            return res.status(400).send({"message":"Bad Request "+err});
        });
    }).catch(err=>{
        return res.status(400).send({"message":"Bad Request "+err});
    });

})

router.delete('/delete/:id',verified,async (req,res)=>{
    const product = Product.findById(req.params.id).remove().exec().then(obj =>{
        return res.json(obj)
    }).catch(err=>{
        console.log("error!")
        return res.status(400).send({"message":"Bad Request "+err});
    })

})

module.exports = router;