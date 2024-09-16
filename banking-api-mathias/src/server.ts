import express from "express";
import {routes} from "./routes.ts";
import {userRoutes} from "./UserRoutes.ts";

const app = express()
app.use(express.json())
app.use(routes)
app.use(userRoutes)

app.listen(3001, () => console.log("Servidor do banco online!"))



