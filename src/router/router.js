class Router {
	//app;
	constructor(app, requestHandler) {
		this.app = app;
		this.handler = requestHandler;
		this.init();
	}
	init() {
		this.app.get('/register', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('register');
			}
		});
		this.app.get('/login', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('login');
			}
		});
	}
}
module.exports = Router;