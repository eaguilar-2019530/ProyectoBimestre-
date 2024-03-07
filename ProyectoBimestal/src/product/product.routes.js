'use strict'

import Express from 'express'
import { UpdateProduct, deleteProduct, getCategory, getName, getProduct, getProductCont, getProductExhausted, save } from './product.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Express.Router()


api.get('/getProduct',[validateJwt], getProduct)
api.get('/getCategory/:id',[validateJwt], getCategory)
api.get('/getProductCont',[validateJwt], getProductCont)
api.post('/getName',[validateJwt], getName)


api.get('/getProductExhausted',[validateJwt, isAdmin], getProductExhausted)
api.post('/save',[validateJwt, isAdmin], save)
api.put('/UpdateProduct/:id', [ validateJwt, isAdmin], UpdateProduct)
api.get('/deleteProduct', [ validateJwt, isAdmin], deleteProduct)


export default api