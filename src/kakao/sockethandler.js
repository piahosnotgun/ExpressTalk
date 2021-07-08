class SocketHandler {
	constructor(server, handler){
		this.server = server;
		this.handler = handler;
		this.api = require('node-kakao');
		console.log("socket.io 리스너가 활성화되었습니다.");
	}
	bindListeners(){
		this.server.on('connection', (client) =>{
			let session = client.handshake.session;
			if(! session.isLogin){
				return;
			}
			let email = session.email;
			let tClient = this.handler.getClient(email);
			let channelList = this.getChannelList(tClient);
			if(! tClient){
				console.log('TalkClient가 제대로 생성되지 않았습니다.');
				return;
			}
			client.on('message', (data)=>{
				let msg = data.text;
				let channelId = data.channelId;
				let channel = channelList[channelId] ?? false;
				if(! channel)
					return;
				channel.sendChat(msg);
			})
			client.on('request', (data) => {
				if(data.type === 'channellist'){
					this.updateChannelList(client, tClient);
				} else if (data.type === ''){
					
				}
			});
			tClient.on('chat', (data, channel)=>{
				let sender = data.getSenderInfo(channel);
				let name = sender.nickname;
				let msg = data.text ?? "(지원되지 않는 메시지 형태입니다)";
				this.updateChannelList(client, tClient);
				channelList = this.getChannelList(tClient);
				this.onMessage(client, tClient, sender, msg, channel.id.toString());
			});
		});
	}
	onMessage(client, tc, sender, msg, channelId){
		client.emit('message', {text: msg, sender: sender, channelId: channelId});
	}
	updateChannelList(client, tc){
		client.emit('data', {type: 'channellist', content: this.getChannelNameList(tc)});
	}
	getChannelList(tc){
        let channelList = tc.channelList;
        let it = channelList.all();
        let result = it.next();
        let ret = {};
        while (!result.done) {
            let channel = result.value;
            let channelId = channel.channelId.toString();
            ret[channelId] = channel;
            result = it.next();
        }
        return ret; // string => TalkChannel
	}
	getChannelNameList(tc){
		let list = this.getChannelList(tc);
		let ret = {};
		for(let channelId in list){
			ret[channelId] = this.getChannelName(list[channelId]);
		}
		return ret; // string => string
	}
	getChannelName(channel){
		let channelName = channel.getDisplayName();
		let userList = channel.getAllUserInfo();
		if(! channelName){
   			let list = [];
    		for (let user of userList) {
      			list.push(user.nickname);
    			channelName = list.join(', ');
  			}
		}
		return channelName;
	}
}
module.exports = SocketHandler;