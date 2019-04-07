const express = require('express');
const app = express();
const router  = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../../app/admin/index');
const query = require('./../../sql/query');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const pool = require('./../../sql/pool');

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/',(req,res)=>{
    res.render('home/login');
});

router.get('/register',(req,res)=>{

    res.render('home/register');

});

router.get('/login',(req,res)=>{
    res.render('home/login');
});


passport.use(new LocalStrategy({usernameField: 'email', },(email, password, cb) => {
    pool.query(query.login_read_query_email_user, [email], (err, result) => {
        if(err) {
            return cb(err);
        }
        if(result.rows.length > 0) {
            const first = result.rows[0];
            bcrypt.compare(password, first.password, function(err, res) {
                if(res) {
                    cb(null, {id : first.userid,email : first.email, type : "user"},{message: first});
                } else {
                    cb(null, false,{message: first})
                }
            })
        } else {
            pool.query(query.login_read_query_email_RO, [email], (err, result) => {
                if(err) {
                    return cb(err);
                }
                if(result.rows.length > 0) {
                    const first = result.rows[0];
                    bcrypt.compare(password, first.password, function(err, res) {
                        if(res) {
                            cb(null, {email : first.email,id : first.userid, type : "RO"},{message: first});
                        } else {
                            cb(null, false,{message: first})
                        }
                    })
                } else {
                    pool.query(query.login_read_query_email_admin, [email], (err, result) => {
                        if(err) {
                            return cb(err);
                        }
                        if(result.rows.length > 0) {
                            const first = result.rows[0];
                            console.log(first);
                            bcrypt.compare(password, first.password, function(err, res) {
                                if(res) {
                                    cb(null, {email : first.email, id : first.userid,type : "admin"},{message: first});
                                } else {
                                    cb(null, false,{message: first})
                                }
                            })
                        } else {
                            cb(null, false)
                        }
                    })
                }
            })
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, cb) => {
    pool.query(query.login_read_query_email, [email], (err, results) => {
        if(err) {
            return cb(err)
        }
        cb(null, results.rows[0])
    })
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {failureFlash:true}, function(err, user,info) {
            if (err) { throw err }
            if (!user) {
                return res.render('home/login', {message:'Wrong user authentication, please login again'});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.cookie('authentication',user.type);
                return res.render('landing/index');
            });
        })(req, res, next);
    }
);

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});




router.post('/register',(req,res)=>{
    let error = [];
    if(!req.body.firstName){
        error.push({message:'please Enter your first Name'});
    }
    if(!req.body.lastName){
        error.push({message:'please Enter your last Name'});
    }
    if(!req.body.email){
        error.push({message:'please Enter your email'});
    }
    if(!req.body.password){
        error.push({message:'please Enter a password'});
    }
    if(!req.body.passwordConfirm){
        error.push({message:'This field cannot be blank'});
    }

    if(req.body.password !== req.body.passwordConfirm){
        console.log(req.body.password+" " + req.body.passwordConfirm);
        error.push({message:'Password field does not match'});
    }
    if(error.length>0){
        res.render('home/register',{
            error: error
        })
    }else{
        pool.query(query.register_no_duplicated_query,[req.body.email])
            .then(result=>{
                if(result.rows.length == 0){
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(req.body.password,salt,(err,hash)=>{
                            if(req.body.authentication == 'user'){
                                pool.query(query.register_insert_query_user[hash,req.body.firstName,req.body.lastName,req.body.email,req.body.telephone])
                                    .then(result=>{
                                            req.flash('success_message',"you are now registered,please login");
                                            res.redirect('/login');
                                        }

                                    ).catch(err=>{
                                    console.log(err);
                                });

                            }else if(req.body.authentication == 'admin'){
                                pool.query(query.register_insert_query_admin,[hash,req.body.firstName,req.body.lastName,req.body.email,req.body.telephone])
                                    .then(result=>{
                                            req.flash('success_message',"you are now registered,please login");
                                            res.redirect('/login');
                                        }

                                    ).catch(err=>{
                                    console.log(err);
                                });

                            }else if(req.body.authentication == 'restaurant'){
                                pool.query(query.register_insert_query_RO,[hash,req.body.firstName,req.body.lastName,req.body.email,req.body.telephone])
                                    .then(result=>{
                                            req.flash('success_message',"you are now registered,please login");
                                            res.redirect('/login');
                                        }

                                    ).catch(err=>{
                                    console.log(err);
                                });

                            }

                        })
                    });
                }else{
                    res.render('home/login',{message:"That email exist, please login"});
                }

            })
            .catch(err=>{
                res.send(err);
            });
    }


});



module.exports = router;