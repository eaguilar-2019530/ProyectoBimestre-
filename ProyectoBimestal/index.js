import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { ADMIN } from './src/user/user.controller.js'

initServer()
connect()
ADMIN()