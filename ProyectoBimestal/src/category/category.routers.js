'use strict'

import Express from 'express'
import { DeleteCategory, UpdateCategory, getCategory, save, test } from './category.controller.js'
import { isAdmin, validateJwt} from '../middlewares/validate-jwt.js'

const api = Express.Router()


api.get('/test', test)
api.get('/getCategory',[validateJwt], getCategory)

api.post('/save',[validateJwt, isAdmin], save)

api.put('/UpdateCategory', [validateJwt, isAdmin], UpdateCategory)

api.delete('/DeleteCAtegory', [validateJwt, isAdmin], DeleteCategory)


export default api