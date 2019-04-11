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
        .then(data=>{
            console.log(data.rows);
            var date  = [];
            var totalSeat = [];
            for(let i=0 ;i < data.rows.length ;i++){
                date[i] =  data.rows[0].sdate.toString().substring(4,15);
                totalSeat.push(data.rows[i].totalnumattendees);
            }
            res.render("complexQuery/HR",{totalSeat:totalSeat, date:date});
        })
})

router.get('/adminMonitor',(req,res)=>{
    const today = new Date();
    pool.query(query.admin_monitor,[today])
        .then(data=>{
            let avgBooking = [];
            for(let i=0;i<data.rows.length;i++){
                let num = data.rows[i].avgbooking;
                num = num.substring(0,4);
                avgBooking.push(num);
            }
            res.render('complexQuery/AM',{data:data.rows,avgBooking:avgBooking})
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
})

module.exports = router;