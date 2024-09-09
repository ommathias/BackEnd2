import express, { json } from "express";

import { rotas } from "./rotas";

const app = express()

app.use(express.json())
app.use(rotas)
app.listen(3001, () => console.log("Servidor rodando!"))


/*
        Configuração inicial do Express e Prisma.
	•	Middleware application.use(express.json()).
	•	Importação e uso das rotas com app.use("/clientes", rotas).
	•	Inicialização do servidor com app.listen(3001).
*/