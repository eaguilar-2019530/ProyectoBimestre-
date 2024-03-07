'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import Product from '../product/product.model.js'
import Receipt from '../receipt/receipt.model.js'
import moment from 'moment'

export const ADMIN = async(req, res)=>{
    try {
        let defaultADMIN = await User.findOne({ username: 'Edson'})
        if (!defaultADMIN) {
            let data = {
                name: 'Edson1',
                surname: 'Aguilar',
                email: 'eaguilar@gmail.com',
                username: 'Edson',
                password: '12345',
                phone: '79641346',
                address: 'Kinal',
                role: 'ADMIN'
            }
            data.password = await encrypt(data.password)
            let user = new User(data)
            await user.save()
        }
    } catch (err) {
        console.error(err)
        return res.status(404).send({message:' Error '})
    }
}

export const register = async(req,res)=>{
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: `Registro exitosamente, Bienvenido ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error registerin user', err})
    }
}

export const login = async(req, res)=>{
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({ $or: [{ username}, { email} ] })
        let receipts = await Product.findOne({ _id: receipt.product })
        let totalReceipt = 0
        let receiptDate = {}
        for(let receipt of receipts){
            let product = await Product.findOne({_id: receipt.product})
            let totalProduct = receipt.cantProduct * product.price
            const  receiptDate = moment(receipt.date, 'DD/MM/YYYY, HH:mm:ss')
            const existingReceipt = receiptDate.format('DD-MM-YYYY')

        }






        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({message: 'Invalid credentials'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Failed to login'})
    }
}

export const update = async(req, res)=>{
    try {
        let { id } = req.params
        let data = req.body 
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missin'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(401).send({message: 'User not fund and not updated'})
        return res.send({message: 'Update user', updatedUser})
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message:`Useraname ${err.keyValue.username} is alredy token`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async(req, res)=>{
    try {
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({_id: id})
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}
