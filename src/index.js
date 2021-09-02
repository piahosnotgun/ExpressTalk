let Router = require('./router/router.js');
let RequestHandler = require('./handler/requesthandler.js');
let Database = require('./database.js');
let SocketHandler = require('./handler/sockethandler.js');

let express = require('express');
let app = express();

let session = require('express-session');
let sharedSession = require('express-socket.io-session');

let bodyParser = require('body-parser');

let readline = require('readline');

let socketio = require('socket.io');

app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(express.static('assets'));

let s = session({
 secret: 's3ss1ons3cr3T#$',
 resave: false,
 saveUninitialized: true
})
app.use(s);


let db = new Database();
let requestHandler = new RequestHandler(app, db);
let router = new Router(app, requestHandler);
router.init();
requestHandler.init();

let server = app.listen(8080, ()=>{
	console.log("Express 서버가 시작되었습니다.");
});

let io = socketio(server);
io.use(sharedSession(s, {
	autosave: true
}));
let socketHandler = new SocketHandler(io, requestHandler);
socketHandler.bindListeners();

// readline
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