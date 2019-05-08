// Framework para crear un servidor web facilmente
const express = require('express')
const cors = require('cors')

//Pluggin para leer archivos
const fs = require('fs')

// Iniciamos el servidor Web desde el metodo express()
const app = express()

// Middlewares
app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use(express.static('public'))

// Rutas
app.use('/api', require('./routes/index.route'))

// Metodo que permite al servidor web escuchar en un puerto especifico
app.listen(4000, () => {
    console.log('El servidor esta ejecutandose en http://localhost:4000/')
})