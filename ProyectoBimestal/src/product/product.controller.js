'use strict'

import product from './product.model.js'
import { checkUpdate } from '../utils/validator.js'

export const save = async(req, res)=>{
    try{    
        let data = req.body
        let product = new Product(data)
        await product.save()
        return res.send({message:  'Animal saved successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error saving animal', err})
    }
}