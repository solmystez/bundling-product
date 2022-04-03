const mongoose = require('mongoose');

const BundleSchema = mongoose.Schema({
    SKU: {
        type:String,
        required:true,
        unique: true,
    },
    qty: {
        type: Array,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    productID: {
        type: Array,
        required: true,
    }
})

module.exports = mongoose.model('bundles',BundleSchema);