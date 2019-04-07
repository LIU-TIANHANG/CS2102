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
    pool.query(query.locations_read_query)
        .then(result=>{
            console.log(result.rows);
            res.render('town/index', { title: 'Location Infomation', data: result.rows });
        })
        .catch(err=>{
            res.send(err);
        })
});

router.get('/insert',(req,res)=>{
    res.render('town/insert');
});

router.post('/insert',(req,res)=>{
    let town = req.body.town;
    pool.query(query.locations_insert_query,[town])
        .then(result=>{
            res.redirect('/town');
        })
        .catch(err=>{
            res.send(err);
        })
});

router.post('/delete/:town',(req,res)=>{

    pool.query(query.locations_delete_query,[req.params.town])
        .then(result=>{
            res.redirect('/town');
        })
        .catch(err=>{
            res.send(err);
        })
});

module.exports = router;