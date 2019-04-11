const express = require('express');
const app = express();
const router  = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../../app/admin/index');
const query = require('./../../sql/query');
const pool = require('./../../sql/pool');

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/restaurantRecommendations',(req,res)=>{
    let userid = req['user'].userid;
    pool.query(query.restaurant_recommendation,[userid])
        .then(result=>{
            res.render('complexQuery/rr',{data : result.rows});
        })
});

router.get('/historyReservation/:resid',(req,res)=>{
    const today = new Date();
    const resid = req.params.resid;
    pool.query(query.history_reservation,[resid,today,resid,today])
        .then(result=>{
            console.log(result.rows);
        })
})

module.exports = router;