import { Router, json, urlencoded } from "express";
import { userRouter } from "./users.router.js";
import { sessionRouter } from "./session.router.js";

export const apiRouter = Router()

apiRouter.use(json())
apiRouter.use(urlencoded({ extended: true }))

apiRouter.use ("/sessions", sessionRouter)
apiRouter.use ("/users", userRouter)