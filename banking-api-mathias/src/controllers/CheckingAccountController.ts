import {database} from "../prisma/database.ts"
import {NextFunction, Request, Response} from "express"

class CheckingAccountController {

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const {name, email, number} = request.body

            if (!name || !email || !number) {
                return response.status(400).send({error: "Please enter a valid data"})
            }

            const checkingAccount = await database.checkingAccount.create({
                data: {
                    name,
                    email,
                    number
                }
            })
            return response.status(201).json({checkingAccount})
        } catch (error) {
            console.log(error);
            return response.status(400).json({error: error})
        }
    }

    async findAll(_req: Request, res: Response) {
        try {
            const checkingAccounts = await database.checkingAccount.findMany()
            return res.status(200).json(checkingAccounts)

        } catch (error) {
            console.log(error);
            return res.status(404).json({error: error})
        }
    }

    async findById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id

            const checkingAccount = await database.checkingAccount.findUnique({
                where: {id}
            })
            if (checkingAccount == null)
                return response.status(404).json({error: "id not found"})

            return response.status(200).json(checkingAccount)
        } catch (error) {
            console.log(error);
            return response.status(404).json({msg: "Error on catch"})
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id
            const {name, email, number} = request.body

            const checkingAccountUpdated = await database.checkingAccount.update({
                where: {id},
                data: {name, number, email}
            })

            return response.status(200).json({checkingAccountUpdated})

        } catch (error) {
            console.log(error);
            return response.status(404).json({error: error})
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id

            await database.checkingAccount.delete({where: {id}})
            return response.status(200).json()

        } catch (error) {
            console.log(error);
            return response.status(404).json({error: error})
        }
    }

    async verifyExistence(request: Request, response: Response, next: NextFunction) {
        try {
            const id = request.params.id
            const checkingAccount = await database.checkingAccount.findUnique({where: {id}})
            if (checkingAccount == null)
                return response.status(404).json({error: "id not found"})

            return next()
        } catch (error) {
            console.log(error);
            return response.status(500).json({error: error})
        }
    }
}

export { CheckingAccountController }

