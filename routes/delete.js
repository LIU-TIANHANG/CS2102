var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});



router.delete('/:id', function(req, res, next) {
    const sql_query = 'DELETE FROM student_info WHERE matric = $1';
    console.log(req.params.id);
    pool.query(sql_query,[req.params.id])
        .then(result=>{
            res.redirect("/select");
        })
        .catch(err=>{
            console.log(err);
        });
});

module.exports = router;
