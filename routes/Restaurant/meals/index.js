const express = require('express');
const router  = express.Router();
const query = require('./../../../sql/query');
const pool = require('./../../../sql/pool');

router.get('/:id',(req,res)=>{
    pool.query(query.serves_read_query,[req.params.id]).then( ( data) => {
        res.render('Restaurant/meals/index', { title: 'Restaurant\'s mealtype', data: data.rows , id:req.params.id});
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/:id/insert',(req,res)=>{
   pool.query(query.meals_read_query)
       .then(result=>{
            res.render('Restaurant/meals/insert',{title: 'add restaurant mealtype',data:result.rows});
       })
       .catch(err=>{
           res.send(err);
       })
});

router.post('/:id/insert',(req,res)=>{
    let mealtype = req.body.mealtype;
    pool.query(query.serves_insert_query,[req.params.id,mealtype])
        .then(result=>{
            res.redirect("/restaurant/meals/" + req.params.id);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.get('/:id/delete/:mealType',(req,res)=>{
   pool.query(query.serves_delete_query,[req.params.id,req.params.mealType])
       .then(result=>{
           res.redirect("/restaurant/meals/" + req.params.id);
       })
       .catch(err=>{
           console.log(err);
           res.send(err);
       })
});
module.exports = router;