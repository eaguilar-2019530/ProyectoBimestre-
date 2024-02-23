'use strict'

import express from 'express'
import {register, login, update, deleteU } from './user.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/deleteU/:id',[validateJwt], deleteU)

api.post('/register', register)
api.post('/login', login)

export default api 