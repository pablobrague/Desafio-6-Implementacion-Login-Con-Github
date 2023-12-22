import { Router } from "express";
import { Usuario } from "../../models/user.js";
import { onlyLoggedWeb } from "../../middlewares/auth.js";
import { hashear } from "../../criptografia.js";
export const userRouterWeb = Router()

userRouterWeb.get('/register', (req, res) =>{
    res.render('register')
})

userRouterWeb.post('/register', async (req, res) => {
    try {
        const userExists = await Usuario.findOne({ email: req.body.email })
        if (userExists) { 
            const userExist = true
            const userMail = userExists.email
            return res.render('register', {userExist, userMail})
        }
        
        req.body.password = hashear(req.body.password)

        const newUser = await Usuario.create(req.body)
        res.redirect('/')
    } catch (err) {
        res.redirect('/register')
    }
})

userRouterWeb.get('/profile', onlyLoggedWeb, async (req, res) => {
    const isAdmin = (req.user.level === 'admin') ? true : false
    res.render('profile', {
        titulo: 'Perfil de Usuario',
        user: req.user,
        isAdmin
    })
})