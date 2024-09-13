import {database} from "../prisma/database.ts";

class CheckingAccountService {
    async create(name: string, email: string, number: string) {
        try {
            const checkingAccount = await database.checkingAccount.create({
                data: {
                    name,
                    email,
                    number
                }
            })
            return checkingAccount
        } catch (error) {
            console.log(`Error creating Checking Account: ${error}`);
            throw error;
        }
    }


    async update(id: string, name: string, email: string, number: string) {
        try {

            const checkingAccount = await database.checkingAccount.findUnique({where: {id}});
            if (!checkingAccount)
                throw new Error(`Checking account does not exist`);

            const checkingAccountUpdated = await database.checkingAccount.update({
                where: {id},
                data: {
                    name,
                    email,
                    number
                }
            })

            return checkingAccountUpdated
        } catch (error) {
            console.log(`Error updating Checking Account: ${error}`);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await database.checkingAccount.delete({where: {id}});
        } catch (error) {
            console.log(`Error deleting Checking Account: ${error}`);
            throw error;
        }
    }

    async getAll() {
        try {
            const checkingAccounts = await database.checkingAccount.findMany({orderBy: {name: "asc"}})

            return checkingAccounts;

        } catch (error) {
            console.log(`Error getting Checking Accounts: ${error}`);
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const checkingAccount = await database.checkingAccount.findUnique({where: {id}});
            if (!checkingAccount)
                throw new Error("Checking account does not exist");

            return checkingAccount;

        } catch (error) {
            console.log(`Error getting specific Checking Account: ${error}`);
            throw error;
        }
    }

    async findByName(name: string) {
        try {
            const checkingAccount = await database.checkingAccount.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                },
                orderBy: {
                    name: "asc"
                }
            })
            return checkingAccount;
        } catch (error) {
            console.error(`Error finding Checking Account: ${error}`);
            throw error;
        }
    }


}

export default CheckingAccountService;