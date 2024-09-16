import {database} from "../prisma/database.ts";
import {NextFunction, Request} from "express";
import {Response} from "express";
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

class AuthController {
    //recebe os dados de autenticaçao e retorna um token de acesso


    async authenticate (req: Request, res: Response)
    {
        try{
            const {email, password} = req.body;
            const user = await database.user.findUnique({where: {email: email}});
            if(!user)
                return res.status(400).json({error: "Invalid user or password"});

            //encontrou user, comparar senhas:
            //compare -> criptografa a senha para comparar com o hash que tem salvo no bd
            const isValidPassword = await compare(password, user.password)
            if(!isValidPassword)
                return res.status(400).json({error: "Invalid user or password"});

            //encontrou user, hash da senha bate, gerar o token:
            //sign é da biblioteca JWT e cria a assinatura com base nos parametros passados
            //a palavra chave nao deve ficar no código, mas no env.
            const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string,{expiresIn: "1m"});

            return res.status(200).json({
                user: {
                    id: user.id,
                    email
                }, token
            })

        }catch(error){
            return res.status(500).json({error: error})
        }
    }

    //checkToken
    async authMiddleware(req: Request, res: Response, next:NextFunction) {
        try{
            const authHeader = req.headers.authorization;
            if(!authHeader)
                return res.status(401).json({error: "Blank Token"})

            //verificando se o Token é válido {período, palavra chave}
            //primeiro, separar. Token vem no formato: Bearer token

            const [,token] = authHeader.split(" ")  //[bearer, token]

            //munido do auth, verifico.

            const decoded = verify(token,process.env.JWT_SECRET as string)
            const { id } = decoded as TokenPayload //tipo CRIADO, declarar fora da classe
            console.log(`ID: ${id}`) //eu posso retornar o ID do token para demais verificações necessárias nesse id (permissões, por exemplo)
            return next()


        }catch(error){
            res.status(401).json({error: error})

        }
    }
}

export {AuthController}