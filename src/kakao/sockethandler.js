let User = require('../user.js');
class SocketHandler {
	constructor(server, handler){
		this.server = server;
		this.handler = handler;
		this.api = require('node-kakao');
		console.log("socket.io 리스너가 활성화되었습니다.");
		this.users = {}; //User[]
	}
	bindListeners(){
		this.server.on('connection', (client) =>{
			let session = client.handshake.session;
			if(! session.isLogin){
				return;
			}
			let email = session.email;
			let tClient = this.handler.getClient(email);
			if(! tClient){
				console.log('TalkClient가 제대로 생성되지 않았습니다.');
				return;
			}
			this.users[email] = new User(client, tClient);
		});
	}
}
module.exports = SocketHandler;