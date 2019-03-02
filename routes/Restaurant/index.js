const express = require('express');
const router  = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();

});

var sql_query = 'SELECT * FROM Restaurants2';

router.get('/', function(req, res, next) {
    pool.query(sql_query, (err, data) => {
        if(err){
            console.log(err);
        }
        res.render('Restaurant/index', { title: 'Restaurants Infomation', data: data.rows });
    });
});

module.exports = router;