import { Router } from "express";
import { Usuario } from "../../models/user.js";
import { hasheadasSonIguales } from "../../criptografia.js";
import passport from "passport";

export const sessionRouterWeb = Router()

sessionRouterWeb.get('/login', (req, res) => {
    res.render('login', { titulo: 'Inicio de Sesión' })
})

sessionRouterWeb.post('/login', async (req, res) => {
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email }).lean()
    if (!usuario) { 
        const retryLogin = true
        return res.render('login', {retryLogin})
    }
    if (!hasheadasSonIguales(password, usuario.password)) {
        const retryLogin = true
        return res.render('login', {retryLogin})
    }

    const userInfo = {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        level: usuario.level
    }
    const isAdmin = (usuario.level === 'admin') ? true : false

    req.login(userInfo, error => {
        if(error){
            return res.redirect('/login')
        }
        res.render('index', {titulo: 'e-commerce', user: req.session['user'], isAdmin})
    })
})

//Github 

sessionRouterWeb.get( "/githublogin", passport.authenticate("github", { scope: ["user:email"]})
)

sessionRouterWeb.get("/githubcallback", passport.authenticate("github", {
    successRedirect: "/profile",
    failureRedirect: "/login",
})
)

sessionRouterWeb.post('/logout', (req, res) => {

    req.logout(error => {
        if (error) {
            return res.send('Algo salio mal')
        }
        res.redirect('/')
    })
})