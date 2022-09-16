const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 8080;


const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

conexion.connect((err) => {
    if (err) {
        console.log(`Error en la conexión: ${err.stack}`)
        return;
    }
    console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
});

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res,) =>{
    res.render('index')
})

app.get('/contacto',(req,res) =>{

        let sql = 'SELECT * FROM contacts';
    
        conexion.query(sql, (err, result) =>{
            if (err) throw err;
            res.render('contacto', { 
                results: result
            });
        });
            
})

app.post('/contacto', (req, res) => {
    const { nombre, email } = req.body;

    if (nombre == "" || email == "") {
    res.render('contacto');
    } else {
    let datos = {
        nombre: nombre,
        email: email
    };

    let sql = 'INSERT INTO contacts SET ?';

    conexion.query(sql, datos, (err, result) => {
        if (err) throw err;
        res.render('contacto'); 
        });
    };
});


app.listen(PORT, () => {
    console.log(`El servidor está trabajando en el Puerto ${PORT}`);
})