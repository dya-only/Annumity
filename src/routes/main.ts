import express from 'express'

// Anime API
import daily from './anime/daily'
import info from './anime/info'
import search from './anime/search'

// Database
import create from './db/create'
import wish from './db/wish'
import watched from './db/watched'
import view from './db/view'

// etc
import del from './db/delete'

const router = express.Router()

router.use('/daily', daily)
router.use('/search', search)
router.use('/info', info)

router.use('/db/create', create)
router.use('/db/wish', wish)
router.use('/db/watched', watched)
router.use('/db/view', view)

router.use('/db/del', del)

export default router