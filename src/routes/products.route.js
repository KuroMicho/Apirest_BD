const express = require('express')
const router = express.Router()
const db = require('../db.js')
const slug = require('slug-generator')
const fs = require('fs')

router.get('/', async (req, res) => {
    console.log("GET")
    const products = db.select().from('products')
    let resultTotal = db.count('id as rows').from('products')
    const query = req.query

    const per_page = (query.per_page || 10) * 1
    const page = (query.page || 1) * 1
    const column_order = query.column_order || 'name'
    const type_order = query.type_order || 'asc'
    products.limit(per_page).offset((page - 1) * per_page)

    products.orderBy(column_order, type_order)

    if (query.search && query.search != "") {
        products.where('name', 'LIKE', `%${query.search}%`)
        resultTotal.where('name', 'LIKE', `%${query.search}%`)
    }
    resultTotal = await resultTotal
    const data = {
        per_page: per_page,
        page: page,
        total: resultTotal[0].rows,
        data: await products
    }

    res.json(data)
})

router.post('/', async (req, res) => {
    console.log("POST")

    let data = req.body
    data.slug = slug(data.name)

    //Subiendo imagen
    let base64Image = data.image.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
    fs.writeFileSync('public/images/' + data.name_image, base64Image, 'base64')
    data.image = data.name_image
    let product = await db('products').insert(data)

    res.send('Guardado')

})

router.delete('/:id', async (req, res) => {
    console.log("DELETE")
    if (!req.params.id) {
        res.send('El id es requerido')
        return false
    }

    await db('products').where('id', req.params.id).del()

    res.send('eliminado')
})

router.get('/:id', async (req, res, next) => {
    const products = await db.select().from('products').where('id', req.params.id)
    /*   let resultTotal = db.count('id as rows').from('products')
  
  
      resultTotal = await resultTotal */

    const data = {
        products: products.length ? products[0] : {}
    }

    res.json(data)

})

router.put('/:id', async (req, res) => {
    console.log("PUT")
    const { id } = req.params

    let product = await db.select().from('products').where('id', id)

    if (!product.length) {
        res.send('el producto no existe')
        return false
    }

    let data = req.body
    data.slug = slug(data.name)

    await db('products').where('id', id).update(data)

    res.send('actualizando')
})

module.exports = router