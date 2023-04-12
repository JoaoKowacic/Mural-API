import { ObjectId } from 'mongodb'
import { app } from '../server.js'
import supertest from 'supertest'



describe('Routes Tests', () => {
    const request = supertest(app)
    let token
    let randomId = new ObjectId(1)
    randomId = randomId.toHexString()
    it('should create a new user', async () => {
        const response = await request.post('/user').send({
            name: 'test',
            email: 'test@email.com',
            password: 'password123'
        })

        expect(response.status).toBe(201)
        expect(response.body.name).toBe('test')
        expect(response.body.email).toBe('test@email.com')
    })

    it('should log in a user with valid credentials', async () => {
        const response = await request.post('/login').send({
            email: 'test@email.com',
            password: 'password123'
        })

        expect(response.status).toBe(200)
        expect(response.body.email).toBe('test@email.com')
        token = response.body.token
    })

    it('should return an error when logging in with invalid credentials', async () => {
        const response = await request.post('/login').send({
            email: 'test@email.com',
            password: 'wrongpassword'
        })

        expect(response.status).toBe(400)
        expect(response.text).toBe('Invalid Credentials')
    })

    describe('POST /message', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request.post('/message')
            expect(response.status).toBe(401)
        })

        it('should create a new message if request is valid', async () => {
            const response = await request
                .post('/message')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test', description: 'Test message' })
            expect(response.status).toBe(201)
            expect(response.body.title).toBe('Test')
            expect(response.body.description).toBe('Test message')
            expect(response.body._id).toBeDefined()

        })
    })
  
    describe('GET /message', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request.get('/message')
            expect(response.status).toBe(401)
        })

        it('should return an array of messages if token is provided', async () => {
            const response = await request
                .get('/message')
                .set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })
    })

    describe('GET /message/:id', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request.get(`/message/${randomId}`)
            expect(response.status).toBe(401)
        })

        it('should return the message if it exists', async () => {
            const response1 = await request
                .post('/message')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test', description: 'Test message' })
            const response2 = await request
                .get(`/message/${response1.body._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response2.status).toBe(200)
            expect(response2.body.title).toBe('Test')
            expect(response2.body.description).toBe('Test message')
        })
    })

    
    describe('PUT /message/:id', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request.put(`/message/${randomId}`)
            expect(response.status).toBe(401)
        })

        it('should update the message if it exists', async () => {
            const response1 = await request
                .post('/message')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test', description: 'Test message' })
            const response2 = await request
                .put(`/message/${response1.body._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'New title',
                    description: 'New description',
                })
            expect(response2.status).toBe(200)
        })
    })
    
    describe('DELETE /message/:id', () => {
        it('should return 401 if token is not provided', async () => {
            const response = await request.delete(`/message/${randomId}`)
            expect(response.status).toBe(401)
        })

        it('should delete the message if it exists', async () => {
            const response1 = await request
                .post('/message')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test', description: 'Test message' })
            const response2 = await request
                .delete(`/message/${response1.body._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response2.status).toBe(200)
        })
    })
})