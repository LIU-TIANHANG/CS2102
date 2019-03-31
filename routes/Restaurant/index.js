const express = require('express');
const router  = express.Router();
const query = require('./../../sql/query');
const { Pool } = require('pg');
const pool = require('./../../sql/pool');

const availability = require('./availability/index');



router.use('/availability', availability);

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
    var cuisineType = req.body.cuisineType;
    pool.query(query.restaurants_insert_query,[name,time,cuisineType,introduction,telephone]).then((result)=>{
        res.redirect('/restaurant');
    }).catch(err => {
        console.log(err);
    });
});

router.get('/update/:id', function(req, res, next) {
    pool.query(query.restaurants_read_query_id,[req.params.id], (err, data) => {
        if(err){
            console.log(err);
        }
        res.render('Restaurant/update', { title: 'Change your restaurant detail', data: data.rows });
    });
});

router.post('/update/:id',(req,res)=>{
    var name = req.body.name;
    var time = req.body.timeSelect;
    var cuisineType = req.body.cuisineType;
    var introduction = req.body.introduction;
    var telephone = req.body.telephone;
    pool.query(query.restaurants_update_query,[name,time,cuisineType,introduction,telephone,req.params.id])
        .then(result=>{
            console.log('hello');
            res.redirect('/restaurant');
        })
        .catch(err=>{
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