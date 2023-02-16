import express from 'express'

const app = express()
const port = process.env.PORT || 3000

import mainRouter from './routes/main'

app.use(express.static('frontend/build'))

app.use('/api', mainRouter)
app.use("*", (_, res) => res.sendFile('frontend/build/index.html'))

app.listen(port, () => console.log('Server is running on 3000\n http://localhost:3000/'))