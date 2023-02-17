import express from 'express'
import getDaily from './anime/daily'
import getInfo from './anime/info'

const router = express.Router()

router.route("/").get((_, res) => {
	res.send("Hello, Main!")
})

router.route("/daily").get(async (_, res) => {
	getDaily().then((resp) => res.json(resp))
})

router.route("/info").get(async (req, res) => {
	const params = req.query as any
	getInfo(params.name).then((resp) => res.json(resp))
})

export default router