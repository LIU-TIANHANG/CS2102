const express = require('express');
const app = express();
const router  = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../../app/admin/index');
// const {userAuthenticated} = require('../../helpers/authentication');

//app.use(passport.initialize());
//app.use(passport.session());

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

router.all('/*',(req,res,next)=>{
    next();
});

router.get('/',(req,res)=>{
    res.render('home/login');
});

router.get('/login',(req,res)=>{

    res.render('home/login');

});


passport.use(new LocalStrategy({usernameField: 'email', },(email, password, cb) => {
    pool.query('SELECT userid, email, password FROM users WHERE email=$1', [email], (err, result) => {
        if(err) {
            return cb(err);
        }
        if(result.rows.length > 0) {
            const first = result.rows[0];
            bcrypt.compare(password, first.password, function(err, res) {
                if(res) {
                    console.log(first.userid);
                    cb(null, {id : first.userid},{message: first});
                } else {
                    cb(null, false,{message: first})
                }
            })
        } else {
            cb(null, false,{message: "hello"})
        }
    })
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, cb) => {
    pool.query('SELECT userid, email, password FROM users WHERE userid=$1', [parseInt(id, 10)], (err, results) => {
        if(err) {
            return cb(err)
        }
        cb(null, results.rows[0])
    })
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {failureFlash:true}, function(err, user,info) {
            if (err) { throw err };
            if (!user) {
                return res.render('home/login', {message:'Wrong user authentication, please login again'});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/restaurant');
            });
        })(req, res, next);
    }
);

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});
router.get('/register',(req,res)=>{

    res.render('home/register');

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
        var noDuplicatedQuery = 'SELECT 1 FROM Users WHERE email= $1';
        var insertQuery = 'INSERT INTO Users VALUES (DEFAULT, $1,$2,$3,$4,$5)';
        pool.query(noDuplicatedQuery,[req.body.email])
            .then(result=>{
                if(result.rows.length == 0){
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(req.body.password,salt,(err,hash)=>{
                            pool.query(insertQuery,[hash,req.body.firstName,req.body.lastName,req.body.email,'standard'])
                                .then(result=>{
                                    req.flash('success_message',"you are now registered,please login");
                                    res.redirect('/login');
                                    }

                                );
                        })
                    });
                }else{
                    req.flash('error_message','That email exist, please login');
                    res.redirect('/login');
                }

            })
            .catch(err=>{
                console.log(err);
            });
        // User.findOne({email : req.body.email}).then(user=>{
        //     if(!user){
        //         const newUser = new User({
        //             firstName:req.body.firstName,
        //             lastName:req.body.lastName,
        //             email:req.body.email,
        //             password:req.body.password,
        //         });
        //         bcrypt.genSalt(10,(err,salt)=>{
        //             bcrypt.hash(newUser.password,salt,(err,hash)=>{
        //                 newUser.password = hash;
        //                 newUser.save().then(savedUser=>{
        //                     req.flash('success_message',"you are now registered,please login");
        //                     res.redirect('/login');
        //                 });
        //             })
        //         });
        //     }else{
        //         req.flash('error_message','That email exist, please login');
        //         res.redirect('/login');
        //     }
        // });


    }


});
router.get('/change_password',(req,res)=>{

    res.render('home/change_password');
});
router.post('/login',(req,res,next)=>{

    passport.authenticate('local', {
        //console.log('hello2');
        successRedirect:( '/',{testing: "test"}),
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);
    //res.render('home/login');

});
router.post("/change_password", function(req, res) {
    var email = req.body.email;
    var newPass = req.body.newPassword;
    if(req.body.password !== req.body.confirm_password){
        req.flash('error_message','The confirm password is different from password');
        res.redirect('/change_password');
    }else{
        User.findOne({email:req.body.email}).then(user=>{
            if(user){
                bcrypt.compare(req.body.password,user.password,(err,matched)=>{
                    if(err) throw err;
                    if(matched){
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(req.body.newPassword,salt,(err,hash)=>{
                                user.password = hash;
                                user.save().then(savedUser=>{
                                    req.flash('success_message','The password has been changed');
                                    res.redirect('/login');
                                });
                            })
                        });

                    }else{
                        req.flash('error_message','The original password is wrong');
                        res.redirect('/change_password');
                    }
                })
            }else{
                req.flash('error_message','The user does not exist, Please register');
                res.redirect('/register');
            }
        })
    }


});

router.get('/change_auth',(req,res)=>{

    res.render('home/change_auth');
});

router.post('/change_auth',(req,res)=>{
    User.findOne({email:req.body.email}).then(user=>{
        if(user){
            user.authentication = req.body.authentication;
            user.save().then(savedUser=>{
                req.flash('success_message','Changed');
                res.redirect('/login');
            });
        }else{
            req.flash('error_message','The user does not exist');
            res.redirect('/change_auth');
        }
    });
});



module.exports = router;