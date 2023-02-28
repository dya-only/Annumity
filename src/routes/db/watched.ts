import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')
  let watchedID: number[] = []

  let sqlREAD = `SELECT * FROM user WHERE email=\"${params.email || ''}\"`

  db.all(sqlREAD, [], (e, rows) => {
    if (e) throw e

    let isAlreadyAdded: boolean = false
    watchedID = JSON.parse(rows[0].watched_id)
    
    for (let i = 0; i < watchedID.length; i++) {
      if (watchedID[i] == parseInt(params.id)) isAlreadyAdded = true
    }

    if (!isAlreadyAdded) {

      console.log('watched added')
      watchedID.push(parseInt(params.id))
  
      let sql = `UPDATE user SET watched_id="${JSON.stringify(watchedID)}" WHERE email="${rows[0].email}"`
    
      db.run(sql, (e) => {
        if (e) return console.error(e.message)
    
      })
    } else {
      console.log('watched already exists')
    }
      
  })

  db.close()
  res.status(200).json({ res: 'success' })
})

export default router