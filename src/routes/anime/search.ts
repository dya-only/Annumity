import laftel from 'laftel.js'
import SearchYT from 'youtube-search'

const opts: SearchYT.YouTubeSearchOptions = {
  maxResults: 1,
  key: "AIzaSyBGJ0_EWoFbTmXu6q19jmqBDGOQ46hqxcY"
}


export default async function getSearch(name: string) {
  let _anime: any = {}
  let pv: any = ''

  await laftel.search(name).then(async (result) => {
    const [anime] = result.results
    if (anime != null || anime != undefined) {
      await laftel.getItem(anime.id).then(async (result) => {
        _anime = result
        await SearchYT(`${result.name} PV`, opts, async (err, results) => {
          if (err) return console.log(err)
          pv = results![0].link
          console.log(await pv)
        })
      })
    }
  })

  return ({ anime: _anime, pv: pv })
}