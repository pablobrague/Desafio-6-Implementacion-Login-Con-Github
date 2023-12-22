import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { githubCallbackUrl, githubClientSecret, githubClienteId } from "../config.js";
import { Usuario } from "../models/user.js";

passport.use("github", new GithubStrategy({
    clientID: githubClienteId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl
}, async function verify (accessToken, refreshToken, profile, done){

    const usuario = await Usuario.findOne ({email: profile.username})
    if (usuario) {
        return done (null, {
            ...registrado.infoPublica(),
            rol: "usuario"
        })
    }

    try {
        const registrado = await Usuario.create({
            email: profile.username,
            password: "(sin especificar)",
            nombre: profile.displayName,
            apellido: "(sin especificar)",
        })
        done (null, {
            ...registrado.infoPublica(),
            rol: "usuario"
        })
    } catch (error) {
        done(error)
    }

    
}))

passport.serializeUser((user,next) => { next(null, user) })
passport.deserializeUser((user,next) => { next(null, user) })

const passportInitialize = passport.initialize()
const passportSession = passport.session()

export function autenticacion (req, res, next) {
    passportInitialize (req, res, () => {
        passportSession(req, res, next)
    })
}