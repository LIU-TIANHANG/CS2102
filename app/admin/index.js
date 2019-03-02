module.exports = {

    login: (req, res) => {
        res.render('home/register');
    },

    logout: (req, res, next) => {
        req.session.destroy((err) => {
            if(err) return next(err)

            req.logout();

            res.sendStatus(200)
        })
    },
};