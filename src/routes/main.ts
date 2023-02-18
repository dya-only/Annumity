import express from 'express'
import getDaily from './anime/daily'
import getInfo from './anime/info'
import getSearch from './anime/search'
import searchRouter from './anime/search'

const router = express.Router()
router.use("/", searchRouter)

router.route("/").get((_, res) => {
	res.send("Hello, Main!")
})

router.route("/daily").get((_, res) => {
	getDaily().then((resp) => res.json(resp))
})

router.route("/info").get((req, res) => {
	const params = req.query as any
	getInfo(params.name).then((resp) => res.json(resp))
})

// router.route("/search").get((req, res) => {
// 	const params = req.query as any
// 	getSearch(params.name).then((resp) => res.json(resp))
// })


export default router