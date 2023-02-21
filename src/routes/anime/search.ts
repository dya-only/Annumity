import express from 'express'
import laftel from 'laftel.js'
import SearchYT from 'youtube-search'

const opts: SearchYT.YouTubeSearchOptions = {
  maxResults: 1,
  key: "AIzaSyBGJ0_EWoFbTmXu6q19jmqBDGOQ46hqxcY"
}

const router = express.Router()

router.route("/").get(async (req, res) => {
	const params = req.query as any
  let pv = ''

  await laftel.search(params.name).then(result => {
    const [anime] = result.results
    if (anime != null || anime != undefined) {
      laftel.getItem(anime.id).then(result => {

        SearchYT(`${result.name} PV`, opts, (err, results) => {
          if(err) return console.log(err)
          
          pv = results![0].link
          res.status(200).json({ anime: result, pv: pv })
        })

      })
    } else {
      res.status(200).json({ anime: 'not found', pv: '' })
    }
  })
})


export default router