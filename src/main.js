import express from "express"
import mongoose from "mongoose"
import { engine } from "express-handlebars"
import { MONGODB_STR_CNX, PORT } from "./config.js"
import { apiRouter } from "./routers/api/apirest.router.js"
import { webRouter } from "./routers/web/web.router.js"
import { activeSession } from "./middlewares/session.js"
import { autenticacion } from "./middlewares/passport.js"

await mongoose.connect(MONGODB_STR_CNX)
console.log('Conectado a la base de datos')

export const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.listen(PORT, () => {
    console.log(`Escuchando en puerto ${PORT}`)
})

app.use(activeSession)
app.use('/static', express.static('./static'))
app.use(autenticacion)
app.use('/api', apiRouter)
app.use('/', webRouter)
