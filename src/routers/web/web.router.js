import { Router, json, urlencoded } from "express";
import { sessionRouterWeb } from "../web/session.router.web.js";
import { userRouterWeb } from "../web/users.router.web.js";
import { productosRouter } from "./productos.router.web.js";

export const webRouter = Router()

webRouter.use(json())
webRouter.use(urlencoded({ extended: true }))

webRouter.use(sessionRouterWeb)
webRouter.use(userRouterWeb)
webRouter.use(productosRouter)

webRouter.get('/', (req, res) => {
    if (!req.session['user']) {
        res.render('login', {titulo: 'Sign In'})
    } else {
        const isAdmin = (req.session['user'].level === 'admin') ? true : false
        res.render('index', {titulo: 'e-commerce', user: req.session['user'], isAdmin})
    }
})
