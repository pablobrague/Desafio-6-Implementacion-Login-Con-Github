import mongoose from "mongoose";
import { randomUUID } from "crypto"

const coleccion = 'Users'

const usuarioSchema = new mongoose.Schema({
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    nombre: { type: String, require: true },
    apellido: { type: String, require: true },
    level: { type: String, require: true, default: 'client'},
    salt: { type: String, require: true }
}, {
    strict: 'throw',
    versionKey: false,
    methods: {
        infoPublica: function(){
            return {
                email: this.email,
                nombre: this.nombre,
                apellido: this.apellido,
            }
        }
    }
})

export const Usuario = mongoose.model(coleccion, usuarioSchema)