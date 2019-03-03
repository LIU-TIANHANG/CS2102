const express = require('express');
const app = express();
const router  = express.Router();
const query = require('./../../sql/query');
const moment = require('moment');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const { Pool , types} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


router.all('/*',(req,res,next)=>{
    next();
});

router.get('/',(req,res)=>{
    pool.query(query.reservations_read_query, (err, data) => {
        if(err){
            console.log(err);
        }
        let date = data.rows[0].rdate;
        var parseFn = function(val) {
            return val === null ? null : moment(val)
        }
        types.setTypeParser(date, parseFn);
        console.log(date);
        res.render('reservation/index', { title: 'Reservation Infomation', data: data.rows });
    });

});




module.exports = router;