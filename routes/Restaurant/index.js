const express = require('express');
const router  = express.Router();
const query = require('./../../sql/query');
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();

});


router.get('/', function(req, res, next) {
    pool.query(query.restaurants_read_query, (err, data) => {
        if(err){
            console.log(err);
        }
        res.render('Restaurant/index', { title: 'Restaurants Infomation', data: data.rows });
    });
});

router.get('/insert',function (req,res) {
    res.render('Restaurant/insert',{ title: 'Restaurants Infomation'});
});

router.post('/insert',function (req,res) {
    var name = req.body.name;
    var time = req.body.timeSelect;
    var introduction = req.body.introduction;
    var telephone = req.body.telephone;

    pool.query(query.restaurants_insert_query,[name,time,introduction,telephone]).then((result)=>{
        res.redirect('/restaurant');
    }).catch(err => {
        console.log(err);
    });
});

router.post('/delete/:id', function(req, res) {
    pool.query(query.restaurants_delete_query,[req.params.id])
        .then(result=>{
            res.redirect("/restaurant");
        })
        .catch(err=>{
            console.log(err);
        });
});

module.exports = router;