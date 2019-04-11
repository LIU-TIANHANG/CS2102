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
    console.log("hi");
    pool.query(query.restaurants_delete_query,[req.params.id])
        .then(result=>{
            res.redirect("/restaurant");
        })
        .catch(err=>{
            console.log(err);
        });
});

router.get('/reservations/:resid',(req,res)=>{
   let resid = req.params.resid;
    pool.query(query.reservations_read_query_resid,[resid,"booked"])
        .then(result=>{
            let date  = [];
            for(let i=0 ;i < result.rows.length ;i++){
                date[i] =  result.rows[i].dateavailable.toString().substring(4,15);
            }
            res.render('Restaurant/reservations',{data:result.rows,date,date});
        })
});

router.post('/reservations/:userid/:aid/:resid',(req,res)=>{
   let userid = req.params.userid;
   let aid = req.params.aid;
    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            await client.query(query.reservations_update_query,["attended",aid,userid]);

            await client.query(query.user_add_point,[userid,10,userid]);
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release();
            res.redirect('/restaurant/reservations/' + req.params.resid);
        }
    })().catch(e => console.error(e.stack))
});

router.post('/reservations/miss/:userid/:aid/:resid',(req,res)=>{
    let userid = req.params.userid;
    let aid = req.params.aid;

    pool.query(query.reservations_update_query,["missing",aid,userid])
        .then(result=>{
            res.redirect('/restaurant/reservations/' + req.params.resid);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.get('/filter',(req,res)=>{
    pool.query(query.cuisines_read_query)
        .then(cuisine=>{
            pool.query(query.meals_read_query)
                .then(mealtype=>{
                    res.render("Restaurant/index3",{cuisine:cuisine.rows, mealtype: mealtype.rows});
                })
        })

});

router.post('/filter',(req,res)=>{
   let cuisine = req.body.cuisine;
   let mealtype = req.body.mealType;
   pool.query(query.filter_query,[cuisine,mealtype])
       .then(result=>{
           console.log(result.rows);
            res.render('Restaurant/index4',{data:result.rows})
       })
       .catch(err=>{
           console.log(err);
           res.send(err);
       })
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