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
        return
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
        return
    }
    res.status(200).json(user)
})

routes.get('/message', authenticateToken, async (req, res) => {
    const messages = await messageController.index(client, req.email.email)
    if (!messages) {
        res.status(400).json({message: 'No posts found'})
        return
    }
    res.status(200).json(messages)
})

routes.get('/message/:id', authenticateToken, async (req, res) => {
    const message = await messageController.show(client, req.params.id)
    if (!message) {
        res.status(400).json({message: 'Post not found'})
        return
    }
    res.status(200).json(message)
})

routes.post('/message', authenticateToken, async (req, res) => {
    const message = await messageController.create(
        client,
        req.body.title,
        req.body.description,
        req.email.email
    )
    if (!message) {
        res.status(500).json({message: 'Error creating post'})
        return
    }
    res.status(201).json(message)
})

routes.put('/message/:id', authenticateToken, async (req, res) => {
    const updatedMessage = await messageController.update(
        client,
        req.params.id,
        req.body.title,
        req.body.description
    )
    if (!updatedMessage) {
        res.status(500).json({message: 'Error updating post'})
        return
    }
    res.status(200).json(updatedMessage)
})

routes.delete('/message/:id', authenticateToken, async (req, res) => {
    const deletedMessage = await messageController.delete(
        client,
        req.params.id
    )
    if (deletedMessage.deletedCount != 1) {
        res.status(500).json({message: 'Error deleting post'})
        return
    }
    res.status(200).json({message: 'Post deleted successfully'})
})

export { routes }
