import express from "express";
import {routes} from "./routes.ts";

const app = express()
app.use(express.json())
app.use(routes)

app.listen(3001, () => console.log("Servidor do banco online!"))



