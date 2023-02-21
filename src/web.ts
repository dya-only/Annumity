import express from 'express'
import path from 'path'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

import mainRouter from './routes/main'

app.use(cors())
app.use(express.static(path.join(__dirname, 'frontend/dist')))

app.use('/api', mainRouter)
app.use("*", (_, res) => res.sendFile(path.join(__dirname, 'frontend/dist/index.html')))

app.listen(port, () => console.log('Server is running on 3000\n http://localhost:3000/'))