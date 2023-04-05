import { MongoClient } from 'mongodb'


export class DatabaseConnection {
   connect() {
      const database_uri = 'mongodb://127.0.0.1:27017'
      const client = new MongoClient(database_uri, {})
      client
         .connect()
         .then(() => {
            console.log('Database connected successfully')
         })
         .catch((err) =>{
            console.error('Error connecting to database:', err)
            return
         })
      
      return client
   }
}