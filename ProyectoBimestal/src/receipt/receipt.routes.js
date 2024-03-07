'use strict'
import { Router } from 'express'
import { UpdateReceiptAdmin, receipt, receiptAdmin, savePurchase } from './receipt.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/receipt',[validateJwt], receipt)
api.get('/receiptAdmin',[validateJwt, isAdmin], receiptAdmin)
api.post('/savePurchase', [validateJwt], savePurchase)
api.put('/UpdateReceiptAdmin',[validateJwt, isAdmin], UpdateReceiptAdmin)

export default api