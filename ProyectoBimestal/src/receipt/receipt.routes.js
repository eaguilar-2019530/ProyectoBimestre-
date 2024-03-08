'use strict'
import { Router } from 'express'
import { UpdateReceiptAdmin, receipt, receiptAdmin, savePurchase, test } from './receipt.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test',[validateJwt], test)
api.get('/receipt',[validateJwt], receipt)
api.get('/receiptAdmin/:id',[validateJwt, isAdmin], receiptAdmin)
api.post('/savePurchase', [validateJwt], savePurchase)
api.put('/UpdateReceiptAdmin/:id',[validateJwt, isAdmin], UpdateReceiptAdmin)

export default api