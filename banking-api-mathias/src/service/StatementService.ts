import {database} from "../prisma/database.ts";


class StatementService {

    async deposit(idCheckingAccount: string, amount: number, description: string) {
        try {
            if (amount <= 0)
                throw new Error("Deposits must be greater than 0");

            const statement = await database.statement.create({
                data: {
                    idCheckingAccount,
                    amount,
                    description,
                    type: "credit"
                }
            })
            return statement
        } catch (error) {
            console.log(`Error creating deposit: ${error}`);
            throw error;
        }
    }

    async getBalance(idCheckingAccount: string) {
        try {
            const aggregate = await database.statement.aggregate({
                _sum: {
                    amount: true
                },
                where: {idCheckingAccount}
            })
            return aggregate._sum.amount ?? 0
        } catch (error) {
            console.log(`Error getting balance: ${error}`);
            throw error;
        }

    }

    async withdraw(idCheckingAccount: string, amount: number, description: string) {
        try {
            const withdraw = await this.createDebit(idCheckingAccount, amount, description);
            return withdraw;

        } catch (error) {
            console.log(`Error with Withdraw: ${error}`);
            throw error;
        }
    }

    async getAll(idCheckingAccount: string) {
        try {
            const statements = await database.statement.findMany({
                where: {
                    idCheckingAccount
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            return statements
        } catch (error) {
            console.error(`Error getting all statements: ${error}`);
            throw error
        }

    }

    async getById(id: string) {
        try {
            const statement = await database.statement.findUnique(
                {
                    where: {
                        id
                    }
                }
            )
            return statement
        } catch (error) {
            console.error(`Error getting statement : ${error}`)
            throw error
        }
    }

    async getByPeriod(idCheckingAccount: string, startDate: Date, endDate: Date) {
        try {
            const statement = await database.statement.findMany({
                where: {
                    idCheckingAccount,
                    createdAt: {
                        gte: startDate,  //greater than or equal = gte
                        lte: endDate     //lesser than or equal = lte
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
            return statement
        } catch (error) {
            console.error(`Error getting statement by period : ${error}`);
            throw error
        }
    }

    async pix(idCheckingAccount: string, amount: number, description: string) {
        try {
            const pix = await this.createDebit(idCheckingAccount, amount, `PIX - ${description}`);
            return pix;

        } catch (error) {
            console.log(`Error creating pix ${error}`)
            throw error;
        }
    }

    async ted(idCheckingAccount: string, amount: number, description: string) {
        try{
            const ted = await this.createDebit(idCheckingAccount, amount, `TED - ${description}`);
            return ted;
        }catch(error){
            console.log(`Error creating pix ${error}`)
            throw error;        }

    }

    private async createDebit(idCheckingAccount: string, amount: number, description: string) {
        try {
            if (amount <= 0)
                throw new Error("Invalid Amount")

            const balance = await this.getBalance(idCheckingAccount);

            if (amount > balance)
                throw new Error(`more gold is required, current balance: ${balance}`);

            const statement = await database.statement.create(
                {
                    data: {
                        idCheckingAccount,
                        amount: amount * -1,
                        description,
                        type: "debit"
                    }
                })
            return statement
        } catch (error) {
            console.error(`Error creating debit : ${error}`);
            throw error        }

    }


}

export {StatementService}