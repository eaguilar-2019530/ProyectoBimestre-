'use strict'

import Category from "./category.model.js"
import Product from '../product/product.model.js'

export const test = (req, res)=>{
    return res.send('Hi')
}

export const save = async(req,res)=>{
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: 'Se agrego correctamete0', category})
    } catch (err) {
        console.error(err)
    }
}

export const getCategory  = async(req, res)=>{
    try {
        let category  = await Category.find()
        if(category.length === 0) return res.status(400).send({message: 'No funciona'})
        return res.send({category})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'No hay categorias existentes'})
    }
}

export const UpdateCategory = async(req, res)=>{
    try {
        let {id} = req.params
        let data = req.body
        let UpdateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!UpdateCategory)return res.status(401).send({message: 'No se pudieron actulizar los  datos de Categoria'})
        return res.send({message:'Correctemete actualizado',UpdateCategory})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error al actulizar'})
    }
}

export const DeleteCategory = async(req,res)=>{
    try {
        let {id} = req.params
        let daleteCategory = await Category.findOneAndDelete({ _id: id })
        if (!daleteCategory) return res.status(404).send({ message: 'Categoria no econtrada y no eliminada' })
        await CategoryDefect(id, res)
        return res.send({ message: `La categoría ${daleteCategory.Category} fue eliminada` })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar' })
    }
}

export const CategoryDefect = async(req,res)=>{
    try {
        let product = await Product.find({category: id})
        if (!product || product.length === 0) return res.status(400).send({ message: 'Se elimino correctamente la categoria que no tenia ningun producto agregado' })
        let categoryDefect = await Category.findOne({ category: 'Por Defecto' })
        if (!categoryDefect)return res.status(400).send({ message: 'No se encontró la categoría por Defecto' })
        await Product.updateMany({categoria: id}, { category: categoryDefect._id })
        return res.send({ message: 'Productos actualizados a la categoría por defecto' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error en hacer la operación por defecto' });
    }
}

export const saveDefect = async(req, res)=>{
    try {
        let searchCategory = await Category.findOne({ category: 'Por Defecto' })
        if (!searchCategory) {
            let data = {
                name: 'Por Defecto',
                description: 'Por defecto no tiene categoria'
            }
            let category = new Category(data)
            await category.save()
            return console.log('Se agrego a categoria por Defecto')
        } 
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: "Erro al agregarlo por defecto"})
    }
}