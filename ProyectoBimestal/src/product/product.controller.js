'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'

export const save = async(req, res)=>{
    try{    
        let data = req.body
        let category = await Category.findOne({_id: data.category})
        if(!category) return res.status(400).send({message: 'Categoria no encontrada'})
        let product = new Product(data)
        await product.save()
        return res.send({message: 'El producto se guardo correctamente' })
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error al guardar el producto', err})
    }
}

export const getProduct = async(req, res)=>{
    try {
        let product = await Product.find({state: true}).populate('category',['name','description'])
        if(product.length === 0) return res.status(400).send({message: 'No se puede ver los productos'})
        return res.send({product})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'No hay ningun producto'})   
    }
}

export const getName = async(req, res)=>{
    try {
        let {nameProduct} = req.body
        let product = await Product.findOne({nameProduct: nameProduct},{state: true})
        if(!product || product.state === fasle)return res.status(404).send({message: 'No existe ningún producto con ese nombre'})
        let productFound = await Product.findOne({_id: product._id}).populate('category', ['name', ' description'])
        return res.send({message: ` Se encontro el producto ${productFound} `})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Erro al listar'})
    }
}

export const getCategory = async(req,res)=>{
    try {
        let {id} = req.params
        let product = await Product.findOne({category: id}, {state: true})
        if(!product || product.state === false) return res.status(404).send({message: 'No existe ningun producto con este nombre'})
        let productFound = await Product.finOne({_id: product._id}).populate('category',['name', 'description'])
        return res.send({message: `Este producto no se encontro ${productFound}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Productos no encontrados'})
    }
}

export const getProductExhausted = async (req, res)=>{
    try {
        let product = await Product.fin({stock: 0})
        if(product.length === 0 || !product) return res.status(404).send({message: 'No hay ningun producto agotado'})
        return res.send({product})
    } catch (err) {
        console.error(err)

    }
}

export const getProductCont = async (req, res)=>{
    try {
        const product = await Product.find().sort({ cont: -1 })
        if(!product || product.length === 0) return res.status(404).send({message: 'Por el momento no hay ningun producto disponible'})
        return res.send({ product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al obtener los productos'})
    }
}

export const UpdateProduct = async ( req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let UpdateProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!UpdateProduct) return res.status(401).send({message: 'No se puede actualiar el producto'})
        return res.send({message: `Se actualizo correctamente ${UpdateProduct}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al actualizar producto'})
    }
}

export const deleteProduct = async(req, res)=>{
    try {
        let {id} = req.params
        let deleteProduct = await Product.findOneAndUpdate({_id: id}, {state: false})
        if(deleteProduct.state === false) return res.send({message: 'El producto ya esta eliminda'})
        if(!deleteProduct) return res.status(404).send({message: 'El producto no se encontro y no se elimino'})
        return res.send({message: ` El producto ${deleteProduct.nameProduct} se elimino correctamente`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al eliminar el producto'})
    }
}