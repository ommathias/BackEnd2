import {database} from "../prisma/database.ts";
import bcrypt from 'bcryptjs';

const {hash} = bcrypt;

class UserService {

    async create(name: string, email: string, password: string) {
        try {

            const userExist = await database.user.findUnique({where: {email: email}});
            if (userExist) {
                throw new Error("User already exists in the database")
            }

            const hashPassword = await hash(password, 10);

            const user = await database.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
                }, select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    name: true,
                    password: false
                }
            })
            return user
        } catch (error) {
            console.log(`Error creating user: ${error}`)
            throw error;
        }
    }

    async getAll() {
        try {
            const users = await database.user.findMany({
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    name: true,
                    password: false
                }
            })
            return users

        } catch (error) {
            console.log(`Error getting users: ${error}`);
            throw error;
        }
    }

    async getById(id: string) {
        try {
            const user = await database.user.findUnique({
                where: {id},
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    name: true,
                    password: false
                }
            });

            return user;
        } catch (error) {
            console.log(`Error getting user: ${error}`);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await database.user.delete({where: {id}});

        } catch (error) {
            console.log(`Error deleting user: ${error}`);
            throw error;
        }
    }
    async update(id: string, name: string, email: string, password: string) {
        try {
            const hashPassword = await hash(password, 10);
            const user = await database.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    password: hashPassword
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    name: true,
                    password: false
                }
            });
            return user;
        } catch (error) {
            console.log(`Error updating user: ${error}`);
            throw error;
        }
    }
    }

export { UserService };