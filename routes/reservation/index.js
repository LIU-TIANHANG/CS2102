// router for reservation
const express = require('express');
const app = express();
const router  = express.Router();
const query = require('./../../sql/query');
const moment = require('moment');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const pool = require('./../../sql/pool');

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/',(req,res)=>{
    pool.query(query.reservations_read_query, (err, data) => {
        if(err){
            console.log(err);
        }
        let date  = [];
        for(let i=0 ;i < data.rows.length ;i++){
            date[i] =  data.rows[i].rdate.toString().substring(4,15);
        }
        res.render('reservation/index', { title: 'Reservation Infomation', data: data.rows, date:date});
    });

});
router.get('/insert',(req,res)=>{
    pool.query(query.restaurants_read_query_name).then(data=>{
        res.render('reservation/insert',{title: 'start your reservation', data: data.rows})
    }).catch(err=>{
        console.log(err);
    })
});

router.post('/confirmation',(req,res)=>{
    let rname = req.body.rname;
    let date = req.body.date;
    res.cookie('rnameAndDate',[rname,date]);
    pool.query(query.restaurants_read_query_id_basedOn_name,[rname]).then(data=>{
        return data.rows[0].rid;

    }).then(rid=>{
        console.log(rid,date);
        pool.query(query.availability_read_query_rid_date,[rid,date])
            .then(result=>{
                // date = dateFormatModifer(result);
                console.log(result.rows);
                res.render('reservation/confirmation',{data:result.rows});
            })
    }).catch(err=>{
            res.send(err);
        });
});

router.post('/insert',(req,res)=>{
    var rname = req.body.rname;
    var date = req.body.date;
    var userId = req["user"].userid;
    console.log(rname,date,timeslot,slot,userId);
    pool.query(query.restaurants_read_query_id_basedOn_name,[rname]).then(data=>{
        return data.rows[0].rid;

    }).then(rid=>{
        pool.query(query.reservations_insert_query,[date,timeslot,slot,userId,rid]).then(
            result=>{
                res.redirect('/reservation');
            }
        )

        console.log(rid);
    })
        .catch(err=>{
        console.log(err);
    })
});


router.post('/delete/:id',(req,res)=> {
    pool.query(query.reservations_delete_query,[req.params.id]).then(data=>{
        res.redirect('/reservation');
    }).catch(err=>{
        if(err){
            console.log(err);
        }
    })
});

function dateFormatModifer(data){
    var date  = [];
    for(let i=0 ;i < data.rows.length ;i++){
        date[i] =  data.rows[0].dateavailable.toString().substring(4,15);
    }
    return date;
}
module.exports = router;