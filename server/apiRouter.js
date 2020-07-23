const { Router } = require('express')

const router = Router()

router.get('/welcome', (req, res) => {
  res.json('Welcome To React Express Starter Kit!')
})

module.exports = router
