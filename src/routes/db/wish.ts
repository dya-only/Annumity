import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')
  let wishID: number[] = []

  let sqlREAD = `SELECT * FROM user WHERE email=\"${params.email || ''}\"`

  db.all(sqlREAD, [], (e, rows) => {
    if (e) throw e

    wishID = JSON.parse(rows[0].wish_id)
    console.log(wishID.includes(params.id))

    if (!wishID.includes(params.id)) {

      console.log('added')
      wishID.push(parseInt(params.id))
  
      let sql = `UPDATE user SET wish_id="${JSON.stringify(wishID)}" WHERE email="${rows[0].email}"`
    
      db.run(sql, (e) => {
        if (e) return console.error(e.message)
    
        console.log('updated', wishID)
      })
    } else {
      console.log('already exists')
    }
      
  })

  db.close()
  res.status(200).json({ res: 'success' })
})

export default router