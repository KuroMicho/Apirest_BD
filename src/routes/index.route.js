const express = require('express')
const router = express.Router()
const Users = require('./users.route')
const Products = require('./products.route') 
const Categories = require('./categories.route') 

router.use('/users', Users)
router.use('/products', Products)
router.use('/categories', Categories)

module.exports = router