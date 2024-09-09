import { Router } from 'express';
import {ClienteController} from "./controllers/ClienteController";

const rotas = Router()
const url = "/cliente"
const clienteController = new ClienteController()

rotas.get(url, clienteController.encontrarTodos)
rotas.get(`${url}/:id`, clienteController.encontrarPorId)
rotas.post(url, clienteController.criar)
rotas.put(`${url}/:id`, clienteController.verificaExistencia, clienteController.atualizar)
rotas.delete(`${url}/:id`, clienteController.verificaExistencia, clienteController.deletar)

export{rotas}

