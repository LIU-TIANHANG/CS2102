const express = require('express');
const router  = express.Router();
const query = require('./../../../sql/query');
const pool = require('./../../../sql/pool');

router.get('/:id',(req,res)=>{
    pool.query(query.offers_read_query,[req.params.id]).then( ( data) => {
        res.render('Restaurant/cuisines/index', { title: 'Restaurant\'s cuisine', data: data.rows , id:req.params.id});
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/:id/insert',(req,res)=>{
   pool.query(query.cuisines_read_query)
       .then(result=>{
            res.render('Restaurant/cuisines/insert',{title: 'add restaurant cuisine',data:result.rows});
       })
       .catch(err=>{
           res.send(err);
       })
});

router.post('/:id/insert',(req,res)=>{
    let Cuisine = req.body.Cuisine;
    pool.query(query.offers_insert_query,[req.params.id,Cuisine])
        .then(result=>{
            res.redirect("/restaurant/cuisines/" + req.params.id);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.get('/:id/delete/:cuisine',(req,res)=>{
   pool.query(query.offers_delete_query,[req.params.id,req.params.cuisine])
       .then(result=>{
           res.redirect("/restaurant/cuisines/" + req.params.id);
       })
       .catch(err=>{
           console.log(err);
           res.send(err);
       })
});
module.exports = router;