'use strict'

import Product from '../product/product.model.js'
import User from '../user/user.model.js'
import Receipt from './receipt.model.js'
import jwt from 'jsonwebtoken'


export const test = async(req, res)=>{
    return res.send('hi')
}

export const savePurchase = async (req, res) => {
    try{
        let data = req.body
        let secretKey = process.env.SECRET_KEY
        let {token} = req.headers
        let {uid} = jwt.verify(token, secretKey)
        data.user = uid
        let product = await Product.findOne({ _id: data.product })
        if (!product) return res.status(404).send({ message: 'Product not found' })
        let user = await User.findOne({ _id: data.user })
        if (!user) return res.status(404).send({ message: 'Client not found' })
        let restaStock = await Product.findById(data.product)
        restaStock.stock -= parseInt(data.amount)
        await restaStock.save()
        let receipt = new Receipt(data)
        await receipt.save()
        return res.send({message: `Purchase registered correctly ${receipt.date} and the stock is updated`, restaStock})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error al realizar la compra'})
    }
};


export const receipt = async(req, res)=>{
    try {
        let { id } = req.user
        let date = new Date()
        const formatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
        const changeDate = new Intl.DateTimeFormat('es-ES', formatOptions).format(date)
        let receipts = await Receipt.find({ user: id, state: true})
        if(receipts || receipts.length === 0){
            return res.status(401).send({ message: 'user no ha agregado nada al carro de compras' });
        }
        await Receipt.updateMany({ user: id, state: true }, { $set: { state: false, date: changeDate} });

        let receiptDetails = []
        let totalReceipt = 0

        for (let receipt of receipts){
            for(let item of receipt.shoppingCart){
                let product = await Product.findOne({_id: item.product})
                if (!product) return res.status(401).send({ message: 'product no encontrado' })
                await Product.findOneAndUpdate({ _id: item.product }, { stock: product.stock - item.productCont })
                let productStock = await Product.findOne({ _id: item.product })
                if (productStock.stock === 0) await Product.findOneAndUpdate({ _id: item.product }, { state: false })

                let totalProduct = item.total
                totalReceipt += + totalProduct.toFixed(2);

                receiptDetails.push({
                    productId: product._id,
                    nameProduct: product.nameProduct,
                    price: product.price,
                    cantproduct: item.cantproduct,
                    total: item.total.toFixed(2),
                });
            }
        }
        return res.send({
            message: `${changeDate}`,
            receiptDetails: receiptDetails,
            totalReceipt: totalReceipt.toFixed(2)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los datos de la factura' });
    }
}

export const receiptAdmin = async(req,res)=>{
    try {
        let { id } = req.params
        let date = new Date()
        const formatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
        const changeDate = new Intl.DateTimeFormat('es-ES', formatOptions).format(date)
        let receipts = await Product.find({ user:id })
        let receiptDetails = []
        let totalReceipt = 0
        for(let receipt of receipts){
            for(let item of receipt.shoppingCart){
                let product = await Product.findOne({ _id: item.product })
                if (!product) return res.status(401).send({ message: 'product no encontrado actualmente' })
                let totalProduct = item.total
                totalReceipt += +totalProduct.toFixed(2)

                receiptDetails.push({
                    productId: product._id,
                    nameProduct: product.nameProduct,
                    price: product.price,
                    cantproduct: item.cantproduct,
                    total: item.total.toFixed(2)
                });
            }
        }
        return res.send({
            message: `${changeDate}`,
            receiptDetails: receiptDetails,
            totalReceipt: totalReceipt.toFixed(2)
        })
    } catch (err) {
        console.error(err)
    }
}


export const UpdateReceiptAdmin = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let searchReceipt = await Receipt.findOne({_id: id})
        if(!searchReceipt) return res.status(404).send({message: 'No se encontro ninguna receipt'})
        if ('date' in data || 'user' in data) {
            return res.status(400).send({ message: 'Algunos datos que no se pueden actualizar' })
        }
        if ('cantProduct' in data && 'product' in data) {
            let productUpdate = await Product.findOne({ _id: data.product })
                data.total = productUpdate.price * data.cantProduct
        } else if ('cantProduct' in data) {
            let product = await Product.findOne({_id: searchReceipt.product})
            data.total = product.price * data.cantProduct
        }
        let updatedReceipt = await Receipt.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
            )
        if(!updatedReceipt)return res.status(403).send({message:'No se puede actualizar'})
        return res.send({message: 'Se ah actualizado',updatedReceipt})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al actualizar la receipt'})
    }
}