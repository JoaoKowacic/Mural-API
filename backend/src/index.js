import { app } from './server.js'

const port = 3333

app.listen(port, () => {
   console.log(`App listening at port ${port}`)
})