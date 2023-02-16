import express from 'express'

const app = express()
const port = process.env.PORT || 3000

import mainRouter from './routes/main'

app.use("/api", mainRouter)

app.listen(port, () => console.log('Server is running on 3000\n http://localhost:3000/'))