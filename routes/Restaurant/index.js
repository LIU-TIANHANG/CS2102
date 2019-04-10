const express = require('express');
const router  = express.Router();
const query = require('./../../sql/query');
const { Pool } = require('pg');
const pool = require('./../../sql/pool');

const availability = require('./availability/index');
const meals = require('./meals/index');
const cuisine = require('./cuisines/index');
const menu = require('./menu/index');

router.use('/availability', availability);
router.use('/meals', meals);
router.use('/cuisines', cuisine);
router.use('/menu',menu);

router.get('/', function(req, res, next) {
    pool.query(query.restaurants_read_query, (err, data) => {
        if(err){
            res.send(err);
        }
        res.render('Restaurant/index', { title: 'Restaurants Infomation', data: data.rows });
    });
});


router.get('/insert',function (req,res) {
    pool.query(query.locations_read_query)
        .then(result=>{
            res.render('Restaurant/insert',{ title: 'Restaurants Information',data:result.rows});
        })
        .catch(err=>{
            console.log(err);
        })
});

router.post('/insert',function (req,res) {
    var id = req['user'].userid;
    var name = req.body.name;
    var introduction = req.body.introduction;
    var telephone = req.body.telephone;
    var oh = req.body.oh;
    var ch = req.body.ch;
    var address = req.body.address;
    var town = req.body.town;
    pool.query(query.restaurants_insert_query,[id,name,oh,ch,telephone,introduction,town,address]).then((result)=>{

        res.redirect('/restaurant/' + id);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
});

router.get('/update/:id', function(req, res, next) {
    pool.query(query.restaurants_read_query_id,[req.params.id])
        .then(data=>{
            pool.query(query.locations_read_query)
                .then(town=>{
                    res.render('Restaurant/update', { title: 'Change your restaurant detail', data: data.rows ,town :town.rows});
                })
                .catch(err=>{
                    res.send(err);
                })
        })
        .catch(err=>{
            res.send(err);
        });
});

router.post('/update/:id',(req,res)=>{
    var id = req['user'].userid;
    var name = req.body.name;
    var introduction = req.body.introduction;
    var telephone = req.body.telephone;
    var oh = req.body.oh;
    var ch = req.body.ch;
    var address = req.body.address;
    var town = req.body.town;
    pool.query(query.restaurants_update_query,[name,oh,ch,introduction,telephone,town,address,req.params.id])
        .then(result=>{
            console.log('hello');
            res.redirect('/restaurant/' + id);
        })
        .catch(err=>{
            res.send(err);
        });

});

router.post('/delete/:id', function(req, res) {
    pool.query(query.restaurants_delete_query,[req.params.id])
        .then(result=>{
            res.redirect("/restaurant/" + req['user'].userid);
        })
        .catch(err=>{
            console.log(err);
        });
});

router.get('/:id', function(req, res, next) {
    pool.query(query.restaurants_read_query_id,[req.params.id], (err, data) => {
        if(err){
            res.send(err);
        }
        if(data == undefined || data.rows.length == 0){
            res.redirect('/restaurant/insert');
        }else{
            res.render('Restaurant/index2', { title: 'Restaurants Infomation', data: data.rows });
        }

    });
});

module.exports = router;