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

      const message = await messageDatabase.deleteOne({_id: messageId})

      return message
   }

   async index(client, email) {
      const messageDatabase = client.db('Mural').collection('messages')

      const messages = await messageDatabase.find({email}).toArray()

      return messages
   }

   async show(client, messageId) {
      const messageDatabase = client.db('Mural').collection('messages')

      const message = await messageDatabase.findOne({_id: messageId})

      return message
   }

   async update(client, messageId, changes) {
      const messageDatabase = client.db('Mural').collection('messages')

      const message = await messageDatabase.updateOne({_id: messageId}, changes)

      return message
   }
}