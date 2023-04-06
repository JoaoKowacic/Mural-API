import { Router } from 'express'
import { UserController } from './controllers/userController.js'
import { MessageController } from './controllers/messageController.js'
import { DatabaseConnection } from './database/connection.js'
import authenticateToken from './middlewares/auth.js'

const databaseHandler = new DatabaseConnection()
const client = databaseHandler.connect()

const userController = new UserController()
const messageController = new MessageController()


const routes = Router()

routes.post('/user' ,async (req, res)=> {
    const user = await userController.create(
        client,
        req.body.name, 
        req.body.email,
        req.body.password
    )
    if (!user){
        res.status(500).send({message: "Error creating user"})
    }
    res.status(201).json(user)
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

routes.get('/message', authenticateToken, async (req, res) => {
    const messages = await messageController.index(client, req.email.email)
    if (!messages) {
        res.json({message: 'No posts found'}).status(400)
    }
    res.json(messages).status(200)
})

routes.get('/message/:id', authenticateToken, async (req, res) => {
    const message = await messageController.show(client, req.params.id)
    if (!message) {
        res.json({message: 'Post not found'}).status(400)
    }
    res.json(message).status(200)
})

routes.post('/message', authenticateToken, async (req, res) => {
    const message = await messageController.create(
        client,
        req.body.title,
        req.body.description,
        req.email.email
    )
    if (!message) {
        res.json({message: 'Error creating post'}).status(500)
    }
    res.json(message).status(201)
})

routes.put('/message/', authenticateToken, async (req, res) => {
    const updatedMessage = await messageController.update(
        client,
        req.body.id,
        req.body.changes
    )
    if (!updatedMessage) {
        res.json({message: 'Error updating post'}).status(500)
    }
    res.json(updatedMessage).status(200)
})

routes.delete('/message/:id', authenticateToken, async (req, res) => {
    const deletedMessage = await messageController.delete(
        client,
        req.params.id
    )
    if (deletedMessage.deletedCount != 1) {
        res.json({message: 'Error deleting post'}).status(500)
    }
    res.json({message: 'Post deleted successfully'}).status(200)
})

export { routes }
