// router for availability related stuff
const express = require('express');
const router  = express.Router();
const query = require('./../../../sql/query');
const pool = require('./../../../sql/pool');

router.get('/:id',(req,res)=>{
    pool.query(query.availability_read_query_rid,[req.params.id]).then( ( data) => {
        var date  = [];
        for(let i=0 ;i < data.rows.length ;i++){
            date[i] =  data.rows[0].dateavailable.toString().substring(4,15);
        }

        res.render('Restaurant/availability/index', { title: 'Restaurant\'s availability', data: data.rows ,date:date, id:req.params.id});
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/:id/insert',function (req,res) {
    pool.query(query.restaurants_read_query_name_basedOn_id,[req.params.id], (err, data) => {
        if(err){
            console.log(err);
        }
        res.render('Restaurant/availability/insert',{ title: 'Availability Information' , rname:data.rows[0].rname});
    });

});


router.post('/:id/insert',function (req,res) {
    var date = req.body.date;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var slot = req.body.slot;
    let error = [];
    if(!date){
        error.push({message:'Please select a date'});
    }
    if(error.length>0) {
        pool.query(query.restaurants_read_query_name_basedOn_id,[req.params.id], (err, data) => {
            if(err){
                res.send(err);
            }
            res.render('Restaurant/availability/insert',{ title: 'Availability Information' , rname:data.rows[0].rname , error :error});
        });
    }else{
        // check for duplicated
        pool.query(query.availability_read_query).then((data) => {
            pool.query(query.availability_insert_query,[req.params.id,date,startTime,endTime,slot]).then(
                result=>{
                    res.redirect('/Restaurant/availability/' + req.params.id)
                }

            ).catch(err=>{
                res.send(err);
            })

        }).catch( err =>{
            if(err){
                res.send(err);
            }
        });
    }

});

router.get('/:id/update/:aid', (req,res)=>{
    pool.query(query.availability_read_query_aid,[req.params.aid])
        .then(data=>{
            var date  = [];
            for(let i=0 ;i < data.rows.length ;i++){
                date[i] =  data.rows[0].dataavailable.toString().substring(4,15);
            }
            res.render('Restaurant/availability/update',{data:data.rows, date:date});
        })
        .catch(err=>{
            res.send(err);
        })
});

router.post('/:id/update/:aid',(req,res)=>{
    var date = req.body.date;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var slot = req.body.slot;
    console.log(date,startTime,endTime,slot);
    pool.query(query.availability_update_query,[date,startTime,endTime,slot,req.params.aid])
        .then(result=>{
            res.redirect('/Restaurant/availability/' + req.params.id);
        })
        .catch(err=>{
            res.send(err);
        })
});

router.get('/:id/delete/:aid',(req,res)=>{
    pool.query(query.availability_delete_query,[req.params.aid])
        .then(result=>{
            res.redirect('/Restaurant/availability/' + req.params.id);
        })
        .catch(err=>{
            res.send(err);
        })
});

module.exports = router;