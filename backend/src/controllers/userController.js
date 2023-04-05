import pkg from 'jsonwebtoken'
import bcrypt  from 'bcryptjs'
const { sign } = pkg 
const { hash, compare } = bcrypt

export class UserController {
   async create(client, name, email, password) {
      const token = sign(
         { email },
         process.env.TOKEN || '1'
      )
      const userData = {
         name: name,
         email: email,
         password: (await hash(password, 10)).toString(),
      }

      const userDatabase = client.db('Mural').collection('users')

      await userDatabase.insertOne(userData)
      
      userData.token = token
      return userData
   }

   async login(client, email, password) {
      const userDatabase = await client.db('Mural').collection('users')

      const user = await userDatabase.findOne({email: email})

      if (user && (await compare(password, user.password))) {
         const token = sign(
            { email },
            process.env.TOKEN || '1'
         )

         user.token = token
         return user
      }
   }
}