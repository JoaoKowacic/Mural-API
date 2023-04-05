import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserController } from '../controllers/userController.js'

describe('UserController', () => {
  let client
  let server

  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const uri =  server.getUri()
    client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

  })

  afterAll(async () => {
    await client.close()
    await server.stop()
  })

  describe('create new user', () => {
    it('should insert a new user in the database', async () => {
        const userController = new UserController()
        const user = await userController.create(
            client,
            'Test', 
            'Test@gmail.com', 
            'password123'
        )
        const users = await client
            .db('Mural')
            .collection('users')
            .find()
            .toArray()
        
        expect(users.length).toBe(1)
        expect(users[0].name).toBe('Test')
        expect(users[0].email).toBe('Test@gmail.com')
        expect(users[0].password).toBe('password123')
        expect(user.insertedId).toEqual(users[0]._id)
    })
  })
})