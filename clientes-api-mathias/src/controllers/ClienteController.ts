import {NextFunction, Request, Response} from 'express';
import {banco} from "../prisma";

class ClienteController {

    async criar(requisicao: Request, resposta: Response) {
        try {
            const {name, email, document} = requisicao.body  //aqui pego o parametro do body (json)
            const cliente = await banco.clientes.create({
                data: {
                    name,
                    email,
                    document
                }
            })
            return resposta.status(201).json(cliente)

        } catch (error) {
            console.log(error)
            return resposta.status(500).json({error: "Erro ao criar cliente"})

        }
    }


    async atualizar(requisicao: Request, resposta: Response) {
        const id = requisicao.params.id                  //pegando id da URL
        const {name, email, document} = requisicao.body // pego o parametro do corpo json

        try {
            const clienteAtualizado = await banco.clientes.update(
                {
                    where: {id},
                    data: {
                        name,
                        email,
                        document
                    }
                })
            return resposta.status(200).json(clienteAtualizado);

        } catch (error) {
            console.error("Erro ao atualizar cliente", error)
            return resposta.status(500).json({error: "Erro ao atualizar cliente"});


        }
    }

    async deletar(requisicao: Request, resposta: Response) {
        try{
            const id = requisicao.params.id
            await banco.clientes.delete({where: {id}})
            return resposta.status(204).json()
        }catch(error){
            console.log(error)
            return resposta.status(500).json({error: "Erro ao deletar cliente"})
        }
    }

    async encontrarPorId(requisicao: Request, resposta: Response) {
        try{
            const id = requisicao.params.id
            const cliente = await banco.clientes.findUnique({where: {id}})
            if(cliente == null)
                return resposta.status(404).json({error:"Cliente nao encontrado"})

            return resposta.status(200).json(cliente)
        }catch(error){
            console.log(error)
            return resposta.status(500).json({error: error})
        }
    }

    async encontrarTodos(requisicao:Request, resposta:Response){
        try{
            const clientes = await banco.clientes.findMany()
            return resposta.status(200).json(clientes)
        }catch(error){
            console.log(error)
            return resposta.status(500).json({error: "Erro ao buscar clientes"})
        }
    }

    async verificaExistencia(requisicao: Request, resposta: Response, next: NextFunction) {
        try{
            const id = requisicao.params.id
            const cliente = banco.clientes.findUnique({where: {id}})
            if(cliente == null)
                return resposta.status(404).json({error: "Cliente no existe"})
            return next()
        }catch(error){
            console.log(error)
            return resposta.status(500).json({error: error})
        }
    }
}
export {ClienteController}