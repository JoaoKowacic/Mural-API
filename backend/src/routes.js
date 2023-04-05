import { Router } from 'express'
import { UserController } from './controllers/userController.js'
import { DatabaseConnection } from './database/connection.js'

const databaseHandler = new DatabaseConnection()
const client = databaseHandler.connect()

const userController = new UserController()


const routes = Router()

routes.post('/user', async (req, res)=> {
    const user = await userController.create(
        client,
        req.body.name, 
        req.body.email,
        req.body.password
    )
    if (!user){
        res.status(500).send({message: "Erro ao cadastrar usuario"})
    }
    res.json(user).status(201)
    return
})

routes.post('/login', async (req, res)=> {
    if (!(req.body.email && req.body.password)) {
        res.status(400).send("All input is required");
    }
    const user =  await userController.login(
        client,
        req.body.email,
        req.body.password
    )
    if (!user) {
        res.status(400).send("Invalid Credentials");
    }
    res.json(user).status(200)
})

export { routes }
