//import {database} from "../prisma/database.ts". //problema do service agora
import {NextFunction, Request, Response} from "express"
import CheckingAccountService from "../service/CheckingAccountService.ts";

class CheckingAccountController {

    private checkingAccountService: CheckingAccountService;

    constructor() {
        this.checkingAccountService = new CheckingAccountService //injeção
    }

    create = async (request: Request, response: Response) => {
        try {


            const {name, email, number} = request.body
            const validate = this.validateNameMailNumber(name,email,number)
            if(!validate.isValid){
                return response.status(400).json({error: validate.msg})
            }

            const checkingAccount = await this.checkingAccountService.create(name, email, number)
            return response.status(201).json({checkingAccount})

        } catch (error) {
            this.handleError(response, error, "Error creating checkingAccount")
        }
    }

    findAll =  async ( response: Response)=> {
        try {
            const checkingAccounts = await this.checkingAccountService.getAll()
            return response.status(200).json(checkingAccounts)

        } catch (error) {
            this.handleError(response, error, "Error finding all checkingAccounts")
        }
    }



    update = async (request: Request, response: Response) => {
        try {
            const id = request.params.id
            const {name, email, number} = request.body
            const validate = this.validateNameMailNumber(name,email,number)

            if(!validate.isValid){
                return response.status(400).json(validate.msg)
            }

            const checkingAccountUpdated = this.checkingAccountService.update(id, name, email, number)

            return response.status(200).json({checkingAccountUpdated})

        } catch (error) {
            this.handleError(response, error, "Error updating CheckingAccount")
        }
    }

    delete =  async (request: Request, response: Response) => {
        try {
            const id = request.params.id
            await this.checkingAccountService.delete(id)
            return response.status(204).json()

        } catch (error) {
            this.handleError(response, error, "Error deleting CheckingAccount")
        }
    }

    findById = async (request: Request, response: Response)=> {
        try {
            const id = request.params.id
            const checkingAccount = await this.checkingAccountService.getById(id)
            if (!checkingAccount)
                return response.status(404).json({error: "id for checkingAccount not found"})

            return response.status(200).json(checkingAccount)
        } catch (error) {
            this.handleError(response, error, "Error finding checkingAccount by id")
        }
    }

    verifyExistence = async (request: Request, response: Response, next: NextFunction)=> {
        try {
            const id = request.params.id
            const checkingAccount = await this.checkingAccountService.getById(id)
            if (checkingAccount == null)
                return response.status(404).json({error: "id for checkingAccount not found"})

            return next()
        } catch (error) {
         this.handleError(response, error, "Error verifying existence")
        }
    }

    findByName = async (request: Request, response: Response)=> {
        try{
            const {name} = request.query

            const checkingAccount = this.checkingAccountService.findByName(name as string)
            return response.status(200).json(checkingAccount)
        }catch (error) {
            this.handleError(response, error, "Error finding checkingAccount by name")
        }

}

    private handleError(response: Response, error: unknown, msg: String) {
        if (error instanceof Error) {
            console.error(`${msg}. ${error.message}`)
            return response.status(400).json({error: error.message})
        } else {
            console.error(`Unexpected error ${error}`)
            return response.status(500).json({error: "An unexpected error occurred."})
        }
    }

    private validateNameMailNumber(name: string, email: string, number: string){
        if (name.trim().length <= 0) { //simplificado, name sempre é string
            return {isValid: false, msg: "invalid name"}
        }
        if (email.trim().length == 0 ) {
            return {isValid: false, msg: "invalid email"}
        }
        if (number.trim().length <=0 ) {
            return {isValid: false, msg: "invalid number"}
        }
        return {isValid: true}
    }
}

export {CheckingAccountController}

