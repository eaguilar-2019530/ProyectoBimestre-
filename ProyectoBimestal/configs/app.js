// Configuración Express

//Importaciones 
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import categoryRouter from '../src/category/category.routers.js'
import productRouter from '../src/product/product.routes.js'
import receiptRouter from '../src/receipt/receipt.routes.js'


//Configuraciones
const app = express()
config()
const port = process.env.PORT || 3200


// Configurar el servidor de express
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

//Declaración de rutas
app.use(userRoutes)
app.use('/category',categoryRouter)
app.use('/product',productRouter)
app.use('/receipt',receiptRouter)

//Levantar el sevidor
export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}