const database = require('../models')
const { compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const jsonSecret = require('../config/jsonSecret')

class AuthService{
    async login(dto){
        const usuario = await database.usuarios.findOne({
            attributes: ['id','email','senha'],
            where: {
                email: dto.email
            }
        })

        if(!usuario){
            throw new Error('Usuário não cadastrado')
        }

        const senhaIguais = await compare(dto.senha, usuario.senha)

        if(!senhaIguais){
            throw new Error('Usuário ou senha invalido')
        }
        //secret is segurancanodejs in md5.czsite
        //eac2f9575ce1db6025e0eaa0f4a57d80
        const accessToken = sign({
            id: usuario.id,
            email: usuario.email
        }, jsonSecret.secret, {
            expiresIn: 86400 //TODO: Jogar o expiresIn em um arquivo de config(Json Web Token)
        })

        return {accessToken}
    }
}

module.exports = AuthService