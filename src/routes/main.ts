import express from 'express'
import getDaily from './anime/daily'

const router = express.Router()

router.route("/").get((_, res) => {
	res.send("Hello, Main!")
})

router.route("/daily").get(async (_, res) => {
	getDaily().then((resp) => res.json(resp))
})

export default router