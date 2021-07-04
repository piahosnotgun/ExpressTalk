class AuthManager {
	constructor(){
		this.api = require('node-kakao');
		this.authApiClient = api.AuthApiClient;
		this.status = api.KnownAuthStatusCode;
		this.util = api.util;
	}
	async register(name, email, password){
		let passcodeRes = await api.requestPasscode(form);
		let passcode; //passcode 클라이언트로부터 받아오기
		let registerRes = api.registerDevice(form, passcode, true);
	}
	getClient(){
		return this.client ?? false;
	}
}
module.exports = AuthManager;