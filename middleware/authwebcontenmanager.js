
var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_inn) {
            return res.redirect('/webcontenmanager/login');
        }

        next();
    },
    /*
    is_admin: function (req, res, next)
    {
        if (!req.session.admin) {

            req.flash('info', 'Maaf, Anda tidak dapat mengakses halaman yang Anda tuju!');
            return res.redirect('/');
        }

        next();
    },
*/
};


module.exports = Auth;
