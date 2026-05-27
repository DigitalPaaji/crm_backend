import express from "express";
import { VerifyAuth } from "../middlewere/getAuth";
import { createTodo, DeleteTodo, getMyTodo, UpdateTodo } from "../controller/TodoController";

const routes = express.Router();

routes.get("/gettodo",VerifyAuth,getMyTodo as any)
routes.post("/create",VerifyAuth,createTodo as any)
routes.delete("/delete/:id",VerifyAuth,DeleteTodo as any)
routes.put("/update/:id",VerifyAuth,UpdateTodo as any)
export default routes

