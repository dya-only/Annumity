import express from 'express'
import sqlite3 from 'sqlite3'

const router = express.Router()

router.route("/").get(async (_, res) => {
  const db = new sqlite3.Database('db/user.db')	

  // db.run('DROP TABLE user')
  db.run('CREATE TABLE user(id integer primary key autoincrement, name text, email text unique, wish_id text, watched_id text)')
  db.close()

  res.status(200).json({ message: 'deleted successful' })
})

export default router