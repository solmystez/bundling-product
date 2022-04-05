const express = require('express')
const router = express.Router()
const verified = require('./verifyToken')
const Bundle = require('../models/Bundle')
const Product = require('../models/Product')

router.get('/', verified, async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        let bundles = await Bundle.find().limit(limit * 1).skip((page - 1) * limit).exec();
        const count = await Bundle.countDocuments();
    
        for (let index = 0; index < bundles.length; index++) {
            var bundle = bundles[index].toObject();
            bundle.bundlingStock = 0;
            for (let i = 0; i < bundle.productID.length; i++) {
                const product = await  Product.find( { SKU: bundle.productID[i] } );
               
                if (product) {
                    if (bundle.bundlingStock !== 0 )bundle.bundlingStock = Math.min(bundle.bundlingStock, (product[0].stock / bundle.qty[i]));
                    else bundle.bundlingStock = (product[0].stock / bundle.qty[i]);
                }
                bundles[index] = bundle;
            }
        }
        res.json({bundles,
            totalPages: Math.ceil(count / limit),
            currentPage: page});
    } catch (e) {
        res.status(400).send({"message": "Bad Request" + e});
    }
})

router.post('/create', verified, async (req, res) => {
    const bundle = new Bundle({
        SKU: req.body.SKU,
        qty: req.body.qty,
        productID: req.body.productID,
        price: 0
    });


    let lenProduct = bundle.productID.length;
    let lenQty = bundle.qty.length;

    if (lenProduct != lenQty) {
        return res.status(400).send({"message": "Request not valid :|"});
    }

    for (let i = 0; i < lenProduct; i++) {
        const query = Product.where({ SKU: bundle.productID[i] });
        query.findOne((err, product) => {
            if (err) {
                return res.status(400).send({"message": "Bad Request " + err});
            }
            if (product) {
                if (product.stock < bundle.productID[i].qty) {
                    return res.status(400).send({"message": "Not enough stock :("});
                } else {
                    bundle.price += (product.price * bundle.qty[i]);
                }
            } else {
                return res.status(400).send({"message": "Product not found :("});
            }

        })
    }


    bundle.save().then((data) => {
        return res.json(data);
    }).catch((err) => {
        res.status(400).send({"message": "Bad Request " + err});
    })

})

router.delete('/delete/:id', verified, async (req, res) => {
    const bundle = Bundle.findById(req.params.id).remove().exec().then(obj => {
        return res.json(obj)
    }).catch(err => {
        console.log("error!")
        return res.status(400).send({ "message": "Bad Request " + err });
    })
})

router.patch('/update/:id', verified, async (req, res) => {
    const bundle = Bundle.findById(req.params.id).then(bundle => {
        bundle.name = req.body.name
        bundle.qty = req.body.qty
        bundle.productID = req.body.productID
        bundle.price = 0

        let lenProduct = bundle.productID.length
        let lenQty = bundle.qty.length
    
        if (lenProduct != lenQty) {
            return res.status(400).send({
                "message": "Request not valid :|"
            })
        }
    
        for (let i = 0; i < lenProduct; i++) {
            const query = Product.where({ SKU: bundle.productID[i] })
            query.findOne((err, product) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({
                        "message": "Bad Request " + err
                    })
                }
                // console.log(product)
                if (product) {
                    if (product.stock < bundle.productID[i].qty) {
                        return res.status(400).send({
                            "message": "Not enough stock :("
                        })
                    }
                    else {
                        bundle.price += (product.price * bundle.qty[i])
                        // console.log(bundle)
                    }
                }
                else {
                    return res.status(400).send({
                        "message": "Product not found :("
                    })
                }
    
            })
        }

        bundle.save()
            .then(
                (data) => {
                    return res.json(data)
                }
            ).catch(err => {
                console.log("error!")
                return res.status(400).send({ "message": "Bad Request " + err });
            })
    }).catch(err => {
        console.log("error!")
        return res.status(400).send({ "message": "Bad Request " + err });
    })

})

module.exports = router
