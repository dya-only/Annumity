import express from 'express'
import sqlite3 from 'sqlite3'
import laftel from 'laftel.js'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')
  
  let sqlREAD = `SELECT * FROM user WHERE email=\"${params.email || ''}\"`
  
  db.all(sqlREAD, [], async (e, rows) => {
    if (e) throw e

    let wishID: number[] = []
    let watchedID: number[] = []
    let wishDATA: any[] = []
    let watchedDATA: any[] = []
  
    wishID = JSON.parse(rows[0].wish_id)
    watchedID = JSON.parse(rows[0].watched_id)
  
    // wish loop
    for (let i = 0; i < wishID.length; i++) {
      await laftel.getItem(wishID[i].toString()).then(result => {
        wishDATA.push({ anime: result })
      })
    }

    // watched loop
    for (let i = 0; i < watchedID.length; i++) {
      await laftel.getItem(watchedID[i].toString()).then(result => {
        watchedDATA.push({ anime: result })
      })
    }
      
    res.status(200).json({ wishID: wishID, watchedID: watchedID, wishDATA: wishDATA, watchedDATA: watchedDATA })
  })
  
  db.close()

})

export default router