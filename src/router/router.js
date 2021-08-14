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
				res.render('talkview');
			}
		})
		this.app.get('/register', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('register');
			} else {
				res.render('talkview');
			}
		});
		this.app.get('/login', (req, res) => {
			let session = req.session;
			if (!session.isLogin) {
				res.render('login');
			} else {
				res.render('talkview');
			}
		});
	}
}
module.exports = Router;