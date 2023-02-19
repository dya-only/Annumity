import express from 'express'

// Anime API
import daily from './anime/daily'
import info from './anime/info'
import search from './anime/search'

// Database
import create from './db/create'

const router = express.Router()

router.use("/daily", daily)
router.use("/search", search)
router.use("/info", info)

router.use("/db/create", create)

export default router