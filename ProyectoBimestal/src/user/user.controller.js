'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import Product from '../product/product.model.js'
import Receipt from '../receipt/receipt.model.js'
import moment from 'moment'

export const TEST = async(req, res)=>{
    console.log('holis')
}

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
        let { email, username, password } = req.body
        let user = await User.findOne({$or: [{ username: username },{ email: email }]})
        let receipts = await Receipt.find({ username: user.id, state: false })
        let totalReceipt = 0
        let receiptDate = {}
        for(let receipt of receipts){
            let product = await Product.findOne({_id: receipt.product})
            let totalProduct = receipt.cantProduct * product.price
            const receiptDate = moment(receipt.date, 'DD/MM/YYYY, HH:mm:ss')
            const changeDate = receiptDate.format('DD-MM-YYYY')
            if (!receiptDate[changeDate]) {
                receiptDate[changeDate] = {
                    detalles: [],
                    total: 0
                }
            }
            receiptDate[changeDate].details.push({
                nameProduct: product.nameProduct,
                cant: receipt.cantProduct,
                price: product.price,
                total: totalProduct.toFixed(2) 
            })
            receiptDate[changeDate].total += totalProduct
            totalReceipt += totalProduct
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
                    token,
                    receiptDate
                }
            )
        }
        return res.status(404).send({message: 'Credenciales invalidas'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error al iniciar sesionhs'})
    }
}

export const update = async(req, res)=>{
    try {
        let {role } = req.user
        let { id } = req.params
        let data = req.body 
        if(role === 'ADMIN'){
            let updatedUserA = await User.findOneAndUpdate(
                {_id : id},
                data,
                {new: true}
                )
                if(!updatedUserA) return res.status(401).send({message: 'user no se puede actulizar'})
                return res.send({message: 'Actualizado',updatedUserA})
        }
        if(role === 'CLIENT'){
            if(id === id){
                let update = checkUpdate(data,id)
                if(!update)return res.status(400).send({message: 'Hay datos que no se pueden actualizar'})
                    let updatedUser = await User.findOneAndUpdate(
                        {_id : id},
                        data,
                        {new: true}
                    )
                    if(!updatedUser) return res.status(401).send({message: 'user no se puedo actulizar'})
                        return res.send({message: 'Actualizado',updatedUser})
            }else{
                return res.status(400).send({message: 'No tienes acceso al actualizar esta cuenta '})
            }              
        }
    } catch (err) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message:`Useraname ${err.keyValue.username} is alredy token`})
        return res.status(500).send({message: 'Error al actualizar cuenta'})
    }
}

export const deleteU = async(req, res)=>{
    try {
        let{role} = req.user
        let {id} = req.params
        console.log(id)
        if(role ==='ADMIN') {
            let deleteU = await User.findOneAndDelete({_id:id})
            return  res.send({message: `El user: ${deleteU.username} se elimino exitosamente`})
        }
        if(role ==='CLIENT'){
            if(uid === id){
                let deleteU = await User.findOneAndDelete({_id:id})
                return  res.send({message: `El user: ${deleteU.username} se elimino exitosamente`})
            }else{
                return res.status(400).send({message:'No puedes eliminar una cuenta que no es tuya'})
            }
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}
