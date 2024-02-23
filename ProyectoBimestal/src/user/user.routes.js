'use strict'

import express from 'express'
import {register, login, update, deleteU } from './user.controller.js'

const api = express.Router()

api.put('/update/:id', update)
api.delete('/deleteU/:id', deleteU)

api.post('/register', register)
api.post('/login', login)

export default api 