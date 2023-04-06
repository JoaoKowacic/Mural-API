import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MessageController } from '../controllers/messageController'

describe('MessageController', () => {
  let client
  let server
  let messageController 

  beforeAll(async () => {
    server = await MongoMemoryServer.create()
    const uri =  server.getUri()
    client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    messageController = new MessageController()
  })

  afterAll(async () => {
    await client.close()
    await server.stop()
  })

  describe('create', () => {
    it('should insert a new message in the database', async () => {
      const message = await messageController.create(
        client,
        'Test message',
        'This is a test message'
      )
      const messages = await client.db('Mural').collection('messages').find().toArray()

      expect(messages.length).toBe(1)
      expect(messages[0].title).toBe('Test message')
      expect(messages[0].description).toBe('This is a test message')
      expect(message.id.insertedId).toEqual(messages[0]._id)

      await client.db('Mural').collection('messages').deleteOne({_id: messages[0]._id})
      
    })
  })

  describe('delete', () => {
    it('should delete a message from the database', async () => {
      const messageId = await client.db('Mural').collection('messages').insertOne({
        title: 'Test message',
        description: 'This is a test message'
      })
      await messageController.delete(client, messageId.insertedId)
      const messages = await client.db('Mural').collection('messages').find().toArray()
      expect(messages.length).toBe(0)
    })
  })

  describe('index', () => {
    it('should return all messages from the database', async () => {
      await client.db('Mural').collection('messages').insertMany([
        {
          title: 'Message 1',
          description: 'This is message 1'
        },
        {
          title: 'Message 2',
          description: 'This is message 2'
        }
      ])
      const messages = await messageController.index(client)

      expect(messages.length).toBe(2)
      expect(messages[0].title).toBe('Message 1')
      expect(messages[1].title).toBe('Message 2')
    })
  })

  describe('show', () => {
    it('should return a message from the database', async () => {
      const messageId = await client.db('Mural').collection('messages').insertOne({
        title: 'Test message',
        description: 'This is a test message'
      })
      const message = await messageController.show(client, messageId.insertedId)

      expect(message.title).toBe('Test message')
      expect(message.description).toBe('This is a test message')
    })
  })

  describe('update', () => {
    it('should update a message in the database', async () => {
      const messageId = await client.db('Mural').collection('messages').insertOne({
        title: 'Test message',
        description: 'This is a test message'
      })
      const changes = {
        $set: {
          title: 'Updated message',
          description: 'This message has been updated'
        }
      }
      await messageController.update(client, messageId.insertedId, changes)
      const message = await client.db('Mural').collection('messages').findOne({_id: messageId.insertedId})

      expect(message.title).toBe('Updated message')
      expect(message.description).toBe('This message has been updated')
    })
  })
})