import { Router } from 'express';
import { CheckingAccountController } from './controllers/CheckingAccountController';
import { StatementController} from "./controllers/StatementController.ts";

const routes = Router();
const checkingAccountController = new CheckingAccountController();
const statementController = new StatementController();
const url = "/checkingaccounts"

routes.get(url, checkingAccountController.findAll)
routes.get(`${url}/:id`, checkingAccountController.findById)
routes.post(url, checkingAccountController.create)
routes.put(`${url}/:id`, checkingAccountController.verifyExistence, checkingAccountController.update)
routes.delete(`${url}/:id`, checkingAccountController.verifyExistence,checkingAccountController.delete)
routes.post(`${url}/:id/deposit`, checkingAccountController.verifyExistence, statementController.deposit)
routes.get(`${url}/:id/statement`, checkingAccountController.verifyExistence, statementController.getStatement)
routes.get(`${url}/:id/balance`, checkingAccountController.verifyExistence, statementController.getBalance)

routes.post(`${url}/:id/withdraw`, checkingAccountController.verifyExistence, statementController.withdraw)
routes.get(`${url}/:id/statement/period`, checkingAccountController.verifyExistence, statementController.getByPeriod)
routes.post(`${url}/:id/statement/pix`, checkingAccountController.verifyExistence, statementController.pix)
routes.post(`${url}/:id/statement/ted`, checkingAccountController.verifyExistence, statementController.ted)




export {routes};