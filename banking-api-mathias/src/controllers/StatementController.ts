import {Request, Response} from "express";
import {StatementService} from "../service/StatementService.ts";

class StatementController {

    private statementService: StatementService;

    constructor() {
        this.statementService = new StatementService //injeção
    }

    deposit = async (request: Request, response: Response) => {
        try {
            const idCheckingAccount = request.params.id;
            const {amount, description} = request.body

            const validation = this.checkAmount(amount,description)
            if(!validation.isValid)
                return response.status(400).json({msg: validation.msg})

            const statement = await this.statementService.deposit(idCheckingAccount, amount, description)
            return response.status(201).json(statement)
        } catch (error) {
            this.handleError(response, error, "error performing deposit")
        }
    }

    getStatement = async (request: Request, response: Response) => {
        try {
            const idCheckingAccount = request.params.id;
            const statement = await this.statementService.getAll(idCheckingAccount);
            return response.status(200).json(statement)
        } catch (error) {
            this.handleError(response, error, "error getting statement")
        }
    }

    getBalance = async (request: Request, response: Response) => {
        try {
            const id = request.params.id;
            const balance = await this.statementService.getBalance(id);

            return response.status(200).json(balance)
        } catch (error) {
            this.handleError(response, error, "Error getting balance")
        }
    }

    withdraw = async (request: Request, response: Response) => {
        const id = request.params.id;
        const {amount, description} = request.body

        const validation = this.checkAmount(amount,description)
        if(!validation.isValid)
            return response.status(400).json({msg: validation.msg})


        try {
            const withdraw = await this.statementService.withdraw(id, amount, description)
            return response.status(200).json(withdraw)
        } catch (error) {
            this.handleError(response, error, "error performing withdraw")
        }
    }

    getByPeriod = async (request: Request, response: Response) => {
        try {
            const idCheckingAccount = request.params.id;
            // exemplo: api/statement/123?startDate=2024-01-01&endDate=2024-01-31
            const {startDate, endDate} = request.query;
            if (!startDate || !endDate) {
                return response.status(400).json({error: "startDate and enDate is required"})
            }

            //new Date() passa as strings em objetos tipo Data
            const start = new Date(startDate as string)
            const end = new Date(endDate as string)
            //O resultado será um objeto Date para start e end que você pode usar para fazer cálculos, comparações ou armazenar no banco de dados.

            //data precisa estar validada. Se a data for inválida, o retorno de getTime() será NaN (Not-a-Number)
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return response.status(400).json({error: "invalid date format"})
            }

            const statement = await this.statementService.getByPeriod(idCheckingAccount, start, end)
            return response.status(200).json(statement)

        } catch (error) {
            this.handleError(response, error, "error fetching statement by period")
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

    private checkAmount(amount: any, description: any)
    {
        if (typeof amount !== "number" || amount <= 0) {
            return {isValid: false, msg: "invalid amount: positive number"}
        }
        if (typeof description !== "string" || description.trim().length == 0 ) {
            return {isValid: false, msg: "invalid description"}
        }
        return {isValid: true}
    }

    pix = async (request: Request, response: Response) => {
        try {
            const idCheckingAccount = request.params.id;
            const {amount, description} = request.body

            const validation = this.checkAmount(amount,description)

            if(!validation.isValid){
                return response.status(400).json({error: validation.msg })
            }

            const pix = await this.statementService.pix(idCheckingAccount, amount, description)
            return response.status(201).json(pix)

        } catch (error) {
            this.handleError(response, error, "Error creating pix")
        }
    }

    ted = async (request: Request, response: Response) => {
        try{
            const idCheckingAccount = request.params.id;
            const {amount, description} = request.body
            const validation = this.checkAmount(amount,description)

            if(!validation.isValid){
                return response.status(400).json({error: validation.msg})
            }

            const ted = await this.statementService.ted(idCheckingAccount, amount, description)
            return response.status(200).json(ted)
        }catch (error) {
            this.handleError(response, error, "Error creating ted")
        }
    }



}

export {StatementController}