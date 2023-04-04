import { listen } from './server.mjs'

const port = 3333

listen(port, () => {
   console.log(`App listening at port ${port}`)
})