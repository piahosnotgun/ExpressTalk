class Router {
	//app;
	constructor(app, requestHandler) {
		this.app = app;
		this.handler = requestHandler;
		this.init();
	}
	init() {
		this.app.get('/', (req, res) => {
			let session = req.session;
			if(! session.isLogin) {
				res.redirect('login');
			} else {
				res.render('app');
			}
		})
		this.app.get('/register', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('register');
			} else {
				res.render('app');
			}
		});
		this.app.get('/login', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('login');
			} else {
				res.render('app');
			}
		});
	}
}
module.exports = Router;