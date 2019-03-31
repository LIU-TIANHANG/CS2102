// router for review
const express = require('express');
const app = express();
const router  = express.Router();
const query = require('./../../sql/query');
const moment = require('moment');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const pool = require('./../../sql/pool');


router.get('/',(req,res)=>{
    pool.query(query.review_read_query)
        .then(result=>{
            res.render('review/index',{data:result.rows});
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })

});

router.get('/insert',(req,res)=>{
    pool.query(query.restaurants_read_query_name)
        .then(result=>{
            res.render('review/insert',{data:result.rows});

        })
        .catch(err=>{
            res.send(err);
        })
});

router.post('/insert',(req,res)=>{
    let rid = req.body.rname;
    let rating = req.body.rating;
    let review = req.body.review;
    let userID = req['user'].userid;
    pool.query(query.review_insert_query,[userID,rid,rating,review])
        .then(result=>{
            res.redirect('/review');
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.post('/delete/:resId/:userId',(req,res)=>{

    pool.query(query.review_delete_query,[req.params.resId,req.params.userId])
        .then(result=>{
            res.redirect('/review');
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.get('/update/:resId/:userId',(req,res)=> {
    pool.query(query.review_read_query_resId_userId,[req.params.resId,req.params.userId])
        .then(result=>{
            res.render('review/update',{data: result.rows});
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.post('/update/:resId/:userId',(req,res)=> {
    let rating = req.body.rating;
    let review = req.body.review;
    pool.query(query.review_update_query,[rating,review,req.params.resId,req.params.userId])
        .then(result=>{
            res.redirect('/review');
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

module.exports = router;