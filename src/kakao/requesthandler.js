class RequestHandler {
	//clients
	constructor(app, db){
		this.app = app;
		this.api = require('node-kakao');
		this.db = db;
		this.clients = {};
		this.pcRequests = {};
	}
	getClient(email){
		return this.clients[email] ?? false;
	}
	init(){
		this.app.post('/kakao/login', (req, res)=>{
			//로그인
			let body = req.body;
			if(typeof body.email === 'undefined' || typeof body.password === 'undefined'){
				res.json({result: "error", message: "잘못된 요청입니다."});
				return;
			}
			//로그인 요청
			this.login(body.email, body.password).then((client)=>{ //TalkClient
				if(! client){
					res.json({result: "error", message: "로그인에 실패했습니다. 아이디나 비밀번호를 다시 한 번 확인해주세요."});
					return;
				}
				let session = req.session;
				session.email = body.email;
				session.isLogin = true;
				this.clients[body.email] = client;
				res.redirect('/');
			});
		});
		
		this.app.post('/kakao/register', (req, res)=>{
			//기기등록
			let session = req.session;
			let body = req.body;
			if(typeof body.email === 'undefined' || typeof body.password === 'undefined' || typeof body.name === 'undefined'){
				res.json({result:"error", message:"잘못된 요청입니다."});
				return;
			}
			
			this.register(body.name, body.email, body.password).then((api)=>{ //AuthApiClient
				if(! api){
					res.json({result: "failed", message:"인증번호 요청에 실패했습니다. 이메일, 비밀번호, 카카오톡이 설치된 기기의 온라인 여부를 확인해주세요."});
					return;
				}
				this.pcRequests[body.email] = api; // AuthApiClient
				session.email = body.email;
				session.password = body.password;
				res.json({result:"requestPasscode"});
				return;
			});
		});
		
		this.app.post('/kakao/passcode', (req, res)=>{
			//인증번호 확인
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
			let api = this.pcRequests[session.email]; // AuthApiClient
			let form = {
				email: session.email,
				password: session.password,
				forced: true
			};
			api.registerDevice(form, body.passcode, true).then((regRes)=> {
				if(! regRes.success){
					res.json({result: "error", message: "잘못된 인증번호입니다. 인증번호가 만료된 경우 페이지를 새로고침한 후 다시 시도해주세요."});
					return;
				}
				
				this.db.addData(api.name, form.email, api.deviceUUID); //DB에 저장
				
				this.login(form.email, form.password).then((client)=>{ //TalkClient
					if(! client){
						res.json({result: "error", message: "로그인에 실패했습니다. 이메일과 아이디를 다시 한 번 확인해주세요."});
						return;
					}
					
					this.clients[form.email] = client;
					delete session.password;
					session.isLogin = true;
					res.redirect('/');
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
		let tokenReq = await authApiClient.create(name, uuid);
		let tokenRes = await tokenReq.login(form);
		if(! tokenRes.success){
			return false;
		}
		let client = new this.api.TalkClient();
		let loginRes = await client.login(tokenRes.result);
		if(! loginRes.success){
			return false;
		}
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
		let passcodeRes = await api.requestPasscode(form);
		if(! passcodeRes.success){
			return false;
		}
		return api;
	}
}
module.exports = RequestHandler;