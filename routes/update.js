var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});



// GET
router.get('/:id', function(req, res, next) {
    var sql_query = 'SELECT * FROM student_info where matric = $1';
    pool.query(sql_query,[req.params.id])
        .then(result=>{
            console.log(result.rows[0]);
            res.render('update', { title: 'Update Database',data:[result.rows[0]]});
        });
});

// POST
router.post('/:id', function(req, res, next) {
    var name    = req.body.name;
    var faculty = req.body.faculty;
    const update_query = "UPDATE student_info SET name = $1 , faculty = $2 WHERE matric = $3";

    pool.query(update_query,[name,faculty,req.params.id])
        .then(result=>{
            res.redirect("/select");
        })
        .catch(err=>{
            console.log(err);
        });
});

module.exports = router;
