const express = require('express');
const app = express();
const router  = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../../app/admin/index');
const query = require('./../../sql/query');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const pool = require('./../../sql/pool');

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/restaurant',(req,res)=>{
    pool.query(query.availability_read_query_count_slot_restaurant)
        .then(result=>{
            let data = result.rows;
            let rname = [];
            let slot = [];
            for(let i=0;i<data.length;i++){
                rname.push(data[i].rname);
                slot.push(data[i].sum);
            }

            res.render('graph/graph_restaurant',{rname:rname,slot:slot});
        })
        .catch(err=>{
            console.log(err);
        });
});


module.exports = router;