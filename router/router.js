class Router {
	//app;
	constructor(app){
		this.app = app;
		this.init();
	}
	init(){
		this.app.get('/', (req, res)=>{
			let session = req.session;
			if(! session.user){
				res.render('login');
			}
		});
	}
}
module.exports = Router;