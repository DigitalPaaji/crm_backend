import express from "express";
import { getSubClientDetals, loginSubClient } from "../../controller/Client/SubClientController";
import { SubClientMiddlewere } from "../../middlewere/SubClientMiddlewere";
import { Clientverify } from "../../middlewere/ClientMiddlewere";
const route = express.Router();

route.post(`/login`,loginSubClient )

route.get("/aboutclient",Clientverify,getSubClientDetals as any)

export default route