class Router {
	//app;
	constructor(app) {
		this.app = app;
		this.init();
	}
	init() {
		this.app.get('/register', (req, res) => {
			let session = req.session;
			if (!session.user) {
				res.render('register');
			}
		});
		this.app.get('/login', (req, res) => {
			let session = req.session;
			if (!session.user) {
				res.render('login');
			}
		});
	}
}
module.exports = Router;