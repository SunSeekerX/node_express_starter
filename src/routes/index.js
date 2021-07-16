const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.json({
    code: 200,
    message: 'Hello node-express-starter!',
    data: {
      method: 'GET',
    },
  })
})

router.post('/', (req, res, next) => {
  res.json({
    code: 200,
    message: 'Hello node-express-starter!',
    data: {
      method: 'POST',
    },
  })
})

router.put('/', (req, res, next) => {
  res.json({
    code: 200,
    message: 'Hello node-express-starter!',
    data: {
      method: 'PUT',
    },
  })
})

router.delete('/', (req, res, next) => {
  res.json({
    code: 200,
    message: 'Hello node-express-starter!',
    data: {
      method: 'DELETE',
    },
  })
})

module.exports = router
