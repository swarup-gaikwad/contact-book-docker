const express = require('express');
const exphbs = require('express-handlebars');
var routes = require('./routes');
var passport = require('passport');
var OutlookStrategy = require('passport-outlook').Strategy;
var session = require('express-session');
var bodyParser = require('body-parser');
const db = require('./database').db; // eslint-disable-line no-unused-vars

var OUTLOOK_CLIENT_ID = "dba9db4d-c9df-42a3-a233-7aad6a6adbd4";
var OUTLOOK_CLIENT_SECRET = "bnbDZRU+mcplEOY29824%$*";

const app = express();
const port = 3000;

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new OutlookStrategy({
    clientID: OUTLOOK_CLIENT_ID,
    clientSecret: OUTLOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/outlook/callback"
},
function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/outlook',
    passport.authenticate('windowslive', {
        scope: [
            'openid',
            'profile',
            'offline_access',
            'https://outlook.office.com/Mail.Read'
        ]
    })
);

app.get('/auth/outlook/callback',
    passport.authenticate('windowslive', {
        failureRedirect: '/ '
    }),
    function (req, res) {
        res.redirect('/');
    }
);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use('/', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));