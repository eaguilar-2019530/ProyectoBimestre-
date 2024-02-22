// Configuración Express

//Importaciones 
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'


//Configuraciones
const app = express()
config()
const port = process.env.PORT || 3200


// Configurar el servidor de express
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors()) //Aceptar o denegar la solicitudes 
app.use(helmet())
app.use(morgan('dev'))

//Declaración de rutas


//Levantar el sevidor
export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}