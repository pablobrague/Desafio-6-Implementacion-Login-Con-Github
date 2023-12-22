import { Router } from "express";
import { Usuario } from "../../models/user.js";
import { hasheadasSonIguales } from "../../criptografia.js"
import passport from "passport";
export const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {

    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email }).lean()
    
    if (!usuario || usuario.password != hasheadasSonIguales(password, usuario.password)) {
        return res.status(400).json({ status: 'Error', message: 'Error al iniciar sesión' })
    }

    const userInfo = {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido
    }

    req.login(userInfo, error => {
        if(error){
            return res.redirect('/login')
        }
        res.status(201).json({ status: 'Success', message: 'Usuario Logueado' })
    })
})

//Github 

sessionRouter.get( "/githublogin", passport.authenticate("github", { scope: ["user:email"]})
)

sessionRouter.get("/githubcallback", passport.authenticate("github", {
    successRedirect: "/profile",
    failureRedirect: "/login",
})
)

sessionRouter.get('/', (req, res) => {
    if (req.session['user']) {
        return res.json(req.session['user'])
    }
    res.status(400).json({status: 'Error', message: 'No hay sesión iniciada'})
})

sessionRouter.post('/logout', (req, res) => {
    req.logout(error => {
        if (error) {
            return res.status(500).json({ status: 'Error', message: error })
        }
        res.status(200).json({ status: 'Success', message: 'Logout Existoso' })
    })
})