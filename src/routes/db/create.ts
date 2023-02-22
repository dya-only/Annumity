import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (req, res) => {
  const params = req.query as any
  const db = new sqlite3.Database('db/user.db')	

  // CREATE DB TABLE
  // db.run('CREATE TABLE user(id integer primary key autoincrement, name text, email text unique, wish_id text, watched_id text)')

  // DELETE DB TABLE
  // db.run('DROP TABLE user')

  let sql = `SELECT * FROM user WHERE email="${params.email}"`

  db.all(sql, [], (e, rows) => {
    if (e) console.log(e)

    if (rows.length == 0) {
      db.run(`INSERT INTO user(name, email, wish_id, watched_id) VALUES(\"${params.name}\", \"${params.email}\", \"[]\", \"[]\")`, (e) => {
        if (e) console.log(e)
      })
    }
  })
  db.close()

  res.status(200).json({ message: 'successful' })
})

export default router