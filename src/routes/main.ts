import express from 'express'
const router = express.Router()

router.route("/").get((_, res) => {
	res.send("Hello, Main!")
})

export default router