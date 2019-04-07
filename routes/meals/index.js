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
    pool.query(query.meals_read_query)
        .then(result=>{
            console.log(result.rows);
            res.render('meals/index', { title: 'Cuisine Infomation', data: result.rows });
        })
        .catch(err=>{
            res.send(err);
        })
});

router.get('/insert',(req,res)=>{
    res.render('meals/insert');
});

router.post('/insert',(req,res)=>{
    let mealtype = req.body.meal;
    pool.query(query.meals_insert_query,[mealtype])
        .then(result=>{
            res.redirect('/meals');
        })
        .catch(err=>{
            res.send(err);
        })
});

router.post('/delete/:meals',(req,res)=>{

    pool.query(query.meals_delete_query,[req.params.meals])
        .then(result=>{
            res.redirect('/meals');
        })
        .catch(err=>{
            res.send(err);
        })
});

module.exports = router;