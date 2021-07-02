class Router {
	//app;
	constructor(app){
		this.app = app;
		this.init();
	}
	init(){
		this.app.get('/', (req, res)=>res.render('index.ejs'));
	}
}
module.exports = Router;