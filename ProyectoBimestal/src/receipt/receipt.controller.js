'use strict'

import Product from '../product/product.model.js'
import User from '../user/user.model.js'
import Receipt from './receipt.model.js'
import jwt from 'jsonwebtoken'


export const test = async (req, res) => {
    return res.send('hi')
}

export const savePurchase = async (req, res) => {
    try {
        
        const { productId, cantProduct, nit } = req.body
        const { id } = req.user
        const user = await User.findOne({ _id: id })
        if (!user) return res.status(400).send({ message: 'user no encontrado' })
        const existingReceipt = await Receipt.findOne({ user: user._id, state: true })
        let receipt
        const product = await Product.findOneAndUpdate(
            { _id: productId, state: true },
            { $inc: { contador: 1 } }
        )
        if (existingReceipt ) {
            const productCart = existingReceipt.carritoCompra.find(item => item.product.toString() === productId)
            console.log(productCart)
            if (productCart) {
                if (product.stock <= 0) {
                    return res.send({ message: 'No tenemos el product seleccionado en stock' })
                } else if (productCart.cantProduct > product.stock) {
                    return res.send({ message: `No tenemos suficiente stock del product, solo tenemos ${product.stock - productCart.cantProduct} unidades` })
                }
                productCart.cantProduct += +cantProduct
                productCart.subtotal = productCart.cantProduct * product.precio
            } else {
                if (product.stock <= 0) {
                    return res.send({ message: 'No tenemos el product seleccionado en stock' })
                } else if (cantProduct > product.stock) {
                    return res.send({ message: `No tenemos suficiente stock del product, solo tenemos ${product.stock} unidades` })
                }

                const subtotal = cantProduct * product.precio
                // Agrega el nuevo product al carritoCompra
                existingReceipt
                    .carritoCompra.push({
                        product: productId,
                        cantProduct: cantProduct,
                        subtotal: subtotal,
                        precioUnitario: product.precio,
                    })
            }
            await existingReceipt.save()
            receipt = existingReceipt
        } else {
            const product = await Product.findOneAndUpdate({ _id: productId, state: true },{ $inc: { cont: 1 } })
            if (!product) return res.status(400).send({ message: 'No se encontró el producto' })
            if (product.stock <= 0) {
                return res.send({ message: 'No tenemos el product seleccionado en stock' })
            } else if (cantProduct > product.stock) {
                return res.send({ message: `No tenemos suficiente stock del product, solo tenemos ${product.stock} unidades` })
            }
            const subtotal = cantProduct * product.precio
            receipt = new Receipt({
                carritoCompra: [{
                    product: productId,
                    cantProduct: cantProduct,
                    subtotal: subtotal,
                    precioUnitario: product.precio,
                }],
                nit: nit,
                user: user._id,
                state: true,
            })
            await receipt.save()
        }
        console.log("receipt agregada:", receipt)
        return res.send({ message: `Se agregó al user ${user.nombre} el product con una cantidad de ${cantProduct}, el subtotal es Q.${receipt.carritoCompra[0].subtotal}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al agregar al carrito' })
    }
}




export const receipt = async (req, res) => {
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
        let receipts = await Receipt.find({ user: id, state: true })
        if (receipts || receipts.length === 0) {
            return res.status(401).send({ message: 'user no ha agregado nada al carro de compras' });
        }
        await Receipt.updateMany({ user: id, state: true }, { $set: { state: false, date: changeDate } });

        let receiptDetails = []
        let totalReceipt = 0

        for (let receipt of receipts) {
            for (let item of receipt.shoppingCart) {
                let product = await Product.findOne({ _id: item.product })
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
        return res.status(500).send({ message: 'Error al obtener los datos de la receipt' });
    }
}

export const receiptAdmin = async (req, res) => {
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
        let receipts = await Product.find({ user: id })
        let receiptDetails = []
        let totalReceipt = 0
        for (let receipt of receipts) {
            for (let item of receipt.shoppingCart) {
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


export const UpdateReceiptAdmin = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let searchReceipt = await Receipt.findOne({ _id: id })
        if (!searchReceipt) return res.status(404).send({ message: 'No se encontro ninguna receipt' })
        if ('date' in data || 'user' in data) {
            return res.status(400).send({ message: 'Algunos datos que no se pueden actualizar' })
        }
        if ('cantProduct' in data && 'product' in data) {
            let productUpdate = await Product.findOne({ _id: data.product })
            data.total = productUpdate.price * data.cantProduct
        } else if ('cantProduct' in data) {
            let product = await Product.findOne({ _id: searchReceipt.product })
            data.total = product.price * data.cantProduct
        }
        let updatedReceipt = await Receipt.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedReceipt) return res.status(403).send({ message: 'No se puede actualizar' })
        return res.send({ message: 'Se ah actualizado', updatedReceipt })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error al actualizar la receipt' })
    }
}