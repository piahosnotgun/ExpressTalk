class RequestHandler {
	//clients
	constructor(app, db){
		this.app = app;
		this.api = require('node-kakao');
		this.db = db;
		this.clients = {};
		this.pcRequests = {};
	}
	init(){
		this.app.post('/kakao/login', (req, res)=>{
			let body = req.body;
			if(typeof body.email === 'undefined' || typeof body.password === 'undefined'){
				res.json({result: "error"});
				return;
			}
			this.login(body.email, body.password).then((client)=>{
				let session = req.session;
				session.email = body.email;
				session.isLogin = true;
				this.clients[body.email] = client;
				res.json({result: "login success"});
				//redirect
			});
		});
		this.app.post('/kakao/register', (req, res)=>{
			let session = req.session;
			let body = req.body;
			if(typeof body.email === 'undefined' || typeof body.password === 'undefined' || typeof body.name === "undefined"){
				res.json({result:"error"});
				return;
			}
			this.register(body.name, body.email, body.password).then((api)=>{
				this.pcRequests[body.email] = api;
				session.email = body.email;
				session.password = body.password;
				res.json({result:"requestPasscode"});
				this.db.addData(body.name, body.email, body.password);
				return;
			});
		});
		this.app.post('/kakao/passcode', (req, res)=>{
			let body = req.body;
			let session = req.session;
			if(typeof session.email === 'undefined' || typeof session.password === 'undefined'){
				res.json({result:"error", message: "no session"});
				return;
			}
			if(typeof body.passcode === 'undefined' || typeof this.pcRequests[session.email] === 'undefined'){ 
				res.json({result:"error", message: "no passcode requests has been received"});
				return;
			}
			let api = this.pcRequests[session.email];
			let form = {
				email: session.email,
				password: session.password,
				forced: true
			};
			delete session.password;
			api.registerDevice(form, body.passcode, true).then(()=> {
				this.login(form.email, form.password).then(()=>{
					res.json({result: "login success"});
				});
			});
		});
	}
	async login(email, password){
		let form = {
			email: email,
			password: password,
			forced: true
		};
		
		const authApiClient = this.api.AuthApiClient;
		let name = this.db.getData(email, 'name');
		let uuid = this.db.getData(email, 'uuid');
		if(! name || ! uuid){
			return false;
		}
		let tokenReq = authApiClient.create(name, uuid);
		let tokenRes = await tokenReq.login(form);
		let client = new this.api.TalkClient();
		let loginRes = await client.login(tokenRes.result);
		return client;
	}
	async register(name, email, password){
		let form = {
			email: email,
			password: password,
			forced: true
		};
		let uuid = this.api.util.randomWin32DeviceUUID();
		let api = await this.api.AuthApiClient.create(name, uuid);
		let passcodeRes = api.requestPasscode(form);
		return api;
	}
}
module.exports = RequestHandler;