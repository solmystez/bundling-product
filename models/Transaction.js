const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    bundles: {
        type:String,
        required:true,
        unique: true,
    },
    qty: {
        type:String,
        required:true,
    },
    total: {
        type:Number,
        required:true,
    },
})

module.exports = mongoose.model('transactions',TransactionSchema);