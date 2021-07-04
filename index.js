let Router = require('./router/router.js');
let AuthManager = require('./kakao/authmanager.js');
let RequestHandler = require('./kakao/requesthandler.js');
let Database = require('./database.js');
let express = require('express');
let app = express();
let session = require('express-session');
let bodyParser = require('body-parser');
let readline = require('readline');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(express.static('assets'));
app.use(session({
 secret: 's3ss1ons3cr3T#$',
 resave: false,
 saveUninitialized: true
}));

let db = new Database();
let requestHandler = new RequestHandler(app, db);
let router = new Router(app, requestHandler);
router.init();
requestHandler.init();

let server = app.listen(8080, ()=>{
	console.log("Express 서버가 시작되었습니다.");
});
let r = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
r.setPrompt('> ');
r.prompt();
r.on('line', (line)=>{
	r.prompt();
	if(line === '/q'){
		process.exit(0);
	}
});
process.on('exit', ()=>{
	db.save();
});