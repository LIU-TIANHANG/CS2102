// index js for menu
const express = require('express');
const router  = express.Router();
const query = require('./../../../sql/query');
const pool = require('./../../../sql/pool');

router.get('/:id',(req,res)=>{
    pool.query(query.menu_read_query,[req.params.id]).then( ( data) => {
        res.render('Restaurant/menu/index', { title: 'Restaurant\'s menu', data: data.rows , id:req.params.id});
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/:id/insert',(req,res)=>{
    res.render('Restaurant/menu/insert',{title: 'add restaurant menu'});
});

router.post('/:id/insert',(req,res)=>{
    let name = req.body.name;
    let price = req.body.price;
    let intro = req.body.intro;
    pool.query(query.menu_insert_query,[name,price,intro,req.params.id])
        .then(result=>{
            res.redirect("/restaurant/menu/" + req.params.id);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
});

router.get('/:id/delete/:menu',(req,res)=>{
   pool.query(query.menu_delete_query,[req.params.id,req.params.menu])
       .then(result=>{
           res.redirect("/restaurant/menu/" + req.params.id);
       })
       .catch(err=>{
           console.log(err);
           res.send(err);
       })
});
module.exports = router;