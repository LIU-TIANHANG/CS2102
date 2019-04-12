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
const { Client } = require('pg');
const client2 = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres'
})

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/',(req,res)=>{
    let userid = req['user'].userid;
    pool.query(query.reservations_read_query_userID,[userid], (err, data) => {
        if(err){
            console.log(err);
        }
        let date  = [];
        for(let i=0 ;i < data.rows.length ;i++){
            date[i] =  data.rows[i].dateavailable.toString().substring(4,15);
        }
        res.render('reservation/index', { title: 'Reservation Infomation', data: data.rows, date:date});
    });
});

router.get('/',(req,res)=>{
    let userid = req['admin'].adminid;
    pool.query(query.reservations_read_query_adminID,[adminid], (err, data) => {
        if(err){
            console.log(err);
        }
        let date  = [];
        for(let i=0 ;i < data.rows.length ;i++){
            date[i] =  data.rows[i].dateavailable.toString().substring(4,15);
        }
        res.render('reservation/index', { title: 'Reservation Infomation', data: data.rows, date:date});
    });
});

router.get('/insert',(req,res)=>{
    res.render('reservation/insert',{title: 'start your reservation'})
});

router.post('/confirmation',(req,res)=>{
    let date = req.body.date;
    res.cookie('date',date);
    pool.query(query.availability_read_query_date_distinct,[date])
        .then(result=>{
            return result.rows;
        })
        .then(async (results)=>{
            var array1 = new Set();
            for(let i=0;i<results.length;i++) {
                let resid = results[i].resid;
                pool.query(query.restaurants_read_query_id, [resid])
                    .then(data => {
                        array1.add(data.rows[0]);
                        return array1;
                    })
                    .then((array1)=>{
                        if(array1.size == results.length){
                            let a2 = [];
                            array1.forEach(item=>{
                                a2.push(item);
                            })
                            res.render("reservation/restaurant",{title: "view available restaurant", data:a2});
                        }
                    })
                    .catch(err => {
                        res.send(err);
                    })
            }
            return array1;
        })
        .catch(err=>{
            res.send(err);
        })
    // pool.query(query.restaurants_read_query_id_basedOn_name,[rname]).then(data=>{
    //     return data.rows[0].resid;
    //
    // }).then(resid=>{
    //
    //     pool.query(query.availability_read_query_resid_date,[resid,date])
    //         .then(result=>{
    //             res.render('reservation/confirmation',{data:result.rows});
    //         })
    // }).catch(err=>{
    //         res.send(err);
    //     });
});

router.post('/selectRestaurant',(req,res)=>{
    let resid = req.body.resid;
    let date = req.cookies.date;

    pool.query(query.availability_read_query_resid_date,[resid,date])
        .then(result=>{
            var date  = [];
            for(let i=0 ;i < result.rows.length ;i++){
                date[i] =  result.rows[i].dateavailable.toString().substring(4,15);
            }
            res.render('reservation/availability',{title: "Select a slot", data : result.rows,date:date,});
        })
})
router.post('/insert',(req,res)=>{
    let aid = req.body.aid;
    let seats = req.body.seatNumber;
    let userId = req["user"].userid;

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            await client.query(query.reservations_insert_query,[seats,userId,aid])
            await client.query(query.availability_minus_seat_query,[aid,seats,aid])
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release();
            res.redirect('/reservation');
        }
    })().catch(e => console.error(e.stack))
    // client2.connect((err,client,done)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     function abort(err){
    //         if(err){
    //             console.log(err);
    //             client.query('ROLLBACK',
    //                 function (err){done();});
    //
    //             return false;
    //         }
    //         return true;
    //     };
    //     client.query('BEGIN',(err,res)=>{
    //         if(abort(err)) return;
    //         console.log("hi");
    //         client.query(query.availability_minus_seat_query,[aid,seats,aid],(err,res)=>{
    //             if(abort(err)) return;
    //             client.query(query.reservations_insert_query,[seats,userId,aid],(err,res)=>{
    //                 if(abort(err)) return;
    //                 client.query('COMMIT',(err)=>{
    //                     if(abort(err)) return;
    //                     done();
    //                     res.redirect('/reservation');
    //                 })
    //             })
    //         })
    //     })
    // })

    // let cookie = req.cookies['rnameAndDate'];
    // let rname = cookie[0];
    // let date = cookie [1];
    // let numOfPeople = req.body.numOfPeople;
    // let userId = req["user"].userid;
    // let aid = req.body.timeslot;
    // pool.query(query.restaurants_read_query_id_basedOn_name,[rname]).then(data=>{
    //     return data.rows[0].resid;
    //
    // }).then(rid=>{
    //     pool.query(query.availability_minus_seat_query,[aid,numOfPeople,aid])
    //         .then(result=>{
    //             pool.query(query.reservations_insert_query,[numOfPeople,userId,aid])
    //                 .then(result=>{
    //                     res.redirect('/reservation');
    //                 })
    //                 .catch(err=>{
    //                     console.log(err);
    //                     res.send(err);
    //                 })
    //         })
    //         .catch(err=>{
    //             res.send(err);
    //         })
    //     // pool.query(query.reservations_insert_query,[date,aid,numOfPeople,userId,rid]).then(
    //     //     result=>{
    //     //         res.redirect('/reservation');
    //     //     }
    //     // )
    //     //
    //     // console.log(rid);
    // })
    //     .catch(err=>{
    //     console.log(err);
    // })
});


router.post('/delete/:aid/:userid',(req,res)=> {
    let aid = req.params.aid;
    let userid = req.params.userid;

    (async () => {
        // note: we don't try/catch this because if connecting throws an exception
        // we don't need to dispose of the client (it will be undefined)
        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            let numPeople =await client.query(query.reservations_read_query_aid_userID,[aid,userid]);
            numPeople = numPeople.rows[0].numpeople;
            await client.query(query.reservations_delete_query,[aid,userid]);
            await client.query(query.availability_add_seat_query,[aid,numPeople,aid]);
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release();
            res.redirect('/reservation');
        }
    })().catch(e => console.error(e.stack))
});



function dateFormatModifer(data){
    var date  = [];
    for(let i=0 ;i < data.rows.length ;i++){
        date[i] =  data.rows[0].dateavailable.toString().substring(4,15);
    }
    return date;
}
module.exports = router;