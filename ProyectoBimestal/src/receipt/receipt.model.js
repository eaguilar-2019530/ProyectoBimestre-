import { Schema, model} from 'mongoose'

const receiptSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    nit:{
        type: String,
        default: 'C/F'
    },
    date:{
        type: String,
        immutable: true,
        default: '0/0/0'
    },
    state:{
        type: Boolean,
        required: false
    },
    shoppingCart:[{
        product:{
            type: Schema.ObjectId,
            ref: 'product',
            required: true
        },
        productQuantity:{
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }]

})

export default model('receipt',receiptSchema)