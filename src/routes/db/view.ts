import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')
  let wishID: number[] = []
  let watchedID: number[] = []

  let sqlREAD = `SELECT * FROM user WHERE email=\"${params.email || ''}\"`

  db.all(sqlREAD, [], (e, rows) => {
    if (e) throw e

    wishID = JSON.parse(rows[0].wish_id)
    watchedID = JSON.parse(rows[0].watched_id)
    
    res.status(200).json({ wish: wishID, watched: watchedID })
  })

  db.close()
})

export default router