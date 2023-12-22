import session from 'express-session'
import connectMongo from 'connect-mongo'
import { MONGODB_STR_CNX } from '../config.js'

const store = connectMongo.create({
    mongoUrl: MONGODB_STR_CNX,
    ttl: 360
})

export const activeSession = session({
    store,
    secret: 'SecretCode',
    resave: true,
    saveUninitialized: true
})
