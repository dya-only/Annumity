import laftel from 'laftel.js'

export default async function getInfo(name: string) {

  let _anime: any = []
  let id: string = ''

  await laftel.search(name).then(async (result) => {
    const anime = result.results[0]
    await laftel.getItem(anime.id).then(result => {
        _anime = result
        id = anime.id
    })
  })

  return ({ anime: _anime, id: id })
}