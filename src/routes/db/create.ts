import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')	

  // CREATE DB TABLE
  // db.run('CREATE TABLE user(id integer primary key autoincrement, name text, email text unique, wish_id text, watched_id text)')

  let sql = `SELECT * FROM user WHERE email="${params.email}"`
  let returnValue = false

    db.all(sql, [], (e, rows) => {
      if (e) console.log(e)

      if (rows.length == 0) {
        db.run(`INSERT INTO user(name, email, wish_id, watched_id) VALUES(\"${params.name}\", \"${params.email}\", \"[]\", \"[]\")`, (e) => {
          if (e) console.log(e)
          returnValue = true
        })
      }
    })
    db.close()

    res.status(200).json({ res: returnValue })
})

export default router