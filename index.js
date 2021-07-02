let Router = require('./router/router.js');
let express = require('express');
let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('html', require('ejs').renderFile);
app.use(express.static('assets'));

let router = new Router(app);
router.init();

let server = app.listen(8080, ()=>{
	console.log("Express 서버가 시작되었습니다.");
});
