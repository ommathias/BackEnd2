import {UserService} from "../service/UserService.ts";
import {NextFunction, Request, Response} from "express";

export class UserController {
    private userService = new UserService();

    constructor() {
        this.userService = new UserService();
    }

    create = async (req: Request, res: Response) => {
        try{
            const {name, email, password} = req.body
            const user = await this.userService.create(name,email,password)
            return res.status(201).json(user)

        }catch (error){
            this.handleError(res, error, "Error creating user")
        }
    }

    getAll = async (_req: Request, res: Response) => {
        try{
            const users = await this.userService.getAll()
            return res.status(200).json(users)
        }catch (error){
            this.handleError(res, error, "Error getting all users")
        }
    }

    getById = async (req: Request, res: Response) => {
        try{
            const id = req.params.id
            if(!this.validateId(id)){
                return res.status(404).json({msg: "user not found"})
            }

            const user = await this.userService.getById(id)
            if(!user){
                return res.status(404).json({msg: "user not found"})
            }
            return res.status(200).json(user)
        }catch (error){
            this.handleError(res, error, "Error getting user by ID")
        }
    }

    update = async (req: Request, res: Response) => {
        try{
            const id = req.params.id
            const {name, email, password} = req.body
            const user = await this.userService.update(id,name,email,password)
            return  res.status(201).json(user)
        }catch (error){
            this.handleError(res, error, "Error updating user")
        }
    }

    delete = async (req: Request, res: Response) => {
        try{
            const id = req.params.id
            await this.userService.delete(id)
            await this.userService.getAll()
            return res.status(200).json({msg: "user deleted successfully"})
        }catch (error){
            this.handleError(res, error, "Error deleting user")
        }
    }

    verifyIfExists = async(req:Request, res: Response, next:NextFunction) => {
        try {
            const id = req.params.id;
            if(!this.validateId(id)){
                return res.status(404).json({msg: "user not found"})
            }
            const user = await this.userService.getById(id);
            if (!user) {
                return res.status(404).json({error: "User not found."});
            }
            return next();
        } catch (error) {
            this.handleError(res, error, "Error verifying if user exists.");
        }
    }

    private validateId(id: string)
    {
        return id.length === 24
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
}
export default new UserController();