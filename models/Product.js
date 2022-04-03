const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    SKU: {
        type:String,
        required:true,
        unique: true,
    },
    name: {
        type:String,
        required:true,
    },
    stock: {
        type:Number,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    }, 
    weight: {
        type:Number,
        default:0
    },
    UOM: {
        type:String,
    },
})

module.exports = mongoose.model('products',ProductSchema);