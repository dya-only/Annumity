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

    let isAlreadyAdded: boolean = false
    wishID = JSON.parse(rows[0].wish_id)
    
    for (let i = 0; i < wishID.length; i++) {
      if (wishID[i] == parseInt(params.id)) isAlreadyAdded = true
    }

    if (params.act == 'add') {
      if (!isAlreadyAdded) {
    
        console.log('wish added')
        wishID.push(parseInt(params.id))
      
        let sql = `UPDATE user SET wish_id="${JSON.stringify(wishID)}" WHERE email="${rows[0].email}"`
        
        db.run(sql, (e) => {
          if (e) return console.error(e.message)
        
        })

        res.status(200).json({ type: 'wish', message: 'success' })
      } else {
        console.log('wish already exists')
        res.status(200).json({ type: 'wish', message: 'exists' })
      }
    } else if (params.act == 'remove') {
      if (isAlreadyAdded) {
    
        console.log('wish removed')
        const _wishID = wishID.filter((e) => e !== params.id)
      
        // let sql = `UPDATE user SET wish_id="${JSON.stringify(wishID)}" WHERE email="${rows[0].email}"`
        
        // db.run(sql, (e) => {
        //   if (e) return console.error(e.message)
        
        // })

        res.status(200).json({ type: 'wish', message: 'success' })
      } else {
        console.log('wish not exists')
        res.status(200).json({ type: 'wish', message: 'not_exists' })
      }
    }
      
  })

  db.close()
  // res.status(200).json({ res: 'success' })
})

export default router