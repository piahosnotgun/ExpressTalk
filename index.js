let Router = require('./router/router.js');
let AuthManager = require('./kakao/authmanager.js');
let express = require('express');
let app = express();
var session = require('express-session');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderFile);

app.use(express.static('assets'));
app.use(session({
 secret: 's3ss1ons3cr3T#$',
 resave: false,
 saveUninitialized: true
}));

let router = new Router(app);
router.init();

let authManager = new AuthManager();
authManager.register('test', 'brianlsh425@gmail.com', 'lsh1017!')

let server = app.listen(8080, ()=>{
	console.log("Express 서버가 시작되었습니다.");
});
