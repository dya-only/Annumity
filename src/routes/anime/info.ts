import express from 'express'
import laftel from 'laftel.js'

const router = express.Router()

router.route("/").get(async (req, res) => {

  const params = req.query as any
	let _anime: any = []
  let id: string = ''

  await laftel.search(params.name).then(async (result) => {
    const anime = result.results[0]
    await laftel.getItem(anime.id).then(result => {
        _anime = result
        id = anime.id
    })
  })

  res.status(200).json({ anime: _anime, id: id })
})

export default router