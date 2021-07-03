class AuthManager {
	constructor(){
		let api = require('node-kakao');
		this.authApiClient = api.AuthApiClient;
		this.status = api.KnownAuthStatusCode;
		this.util = api.util;
	}
	async register(name, email, password){
		let form = {
			email: email,
			password: password,
			forced: true
		};
		let uuid = this.util.randomWin32DeviceUUID();
		let api = await this.authApiClient.create(name, uuid);
		console.log(api);
		let passcodeRes = await api.requestPasscode(form);
		let passcode; //passcode 클라이언트로부터 받아오기
		let registerRes = api.registerDevice(form, passcode, true);
	}
	async login(email, password){
		let form = {
			email: email,
			password: password,
			forced: true
		};
		// TODO: get name, uuid from db
		// let api = this.authApiClient.create(name, uuid);
		// let loginRes = api.login(form);
	}
}
module.exports = AuthManager;