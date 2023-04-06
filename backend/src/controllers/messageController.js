import { ObjectId } from "mongodb"

export class MessageController {
   async create(client, title, description, email) {
      const messageData = {
         title: title,
         description: description,
         email: email
      }

      const messageDatabase = client.db('Mural').collection('messages')

      const messageId = await messageDatabase.insertOne(messageData)
      
      return messageData
   }

   async delete(client, messageId) {
      const messageDatabase = client.db('Mural').collection('messages')
      const id = new ObjectId(messageId)
      const message = await messageDatabase.deleteOne({_id: id})

      return message
   }

   async index(client, email) {
      const messageDatabase = client.db('Mural').collection('messages')

      const messages = await messageDatabase.find({email: email}).toArray()

      return messages
   }

   async show(client, messageId) {
      const messageDatabase = client.db('Mural').collection('messages')
      const id = new ObjectId(messageId)
      const message = await messageDatabase.findOne({_id: id})

      return message
   }

   async update(client, messageId, title, description) {
      const data = {$set : {
         title: title,
         description: description         
      }}
      const messageDatabase = client.db('Mural').collection('messages')
      const id = new ObjectId(messageId)
      const message = await messageDatabase.updateOne({_id: id}, data)
      return message
   }
}