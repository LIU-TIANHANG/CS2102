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

router.get('/',(req,res)=>{
    pool.query(query.cuisines_read_query)
        .then(result=>{
            console.log(result.rows);
            res.render('cuisines/index', { title: 'cuisine Infomation', data: result.rows });
        })
        .catch(err=>{
            res.send(err);
        })
});

router.get('/insert',(req,res)=>{
    res.render('cuisines/insert');
});

router.post('/insert',(req,res)=>{
    let cuisine = req.body.cuisine;
    pool.query(query.cuisines_insert_query,[cuisine])
        .then(result=>{
            res.redirect('/cuisine');
        })
        .catch(err=>{
            res.send(err);
        })
});

router.post('/delete/:cuisine',(req,res)=>{

    pool.query(query.cuisines_delete_query,[req.params.cuisine])
        .then(result=>{
            res.redirect('/cuisine');
        })
        .catch(err=>{
            res.send(err);
        })
});

module.exports = router;