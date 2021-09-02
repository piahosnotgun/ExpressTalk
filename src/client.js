class Client {
	constructor(socket, tc) {
		this.socket = socket;
		this.tc = tc;
		this.channelList = this.getChannelList(tc);
		this.bindSocket();
		this.bindTalkClient();
		this.sendChannelList(socket, tc);
	}
	bindSocket() {
		this.socket.on('message', (data) => {
			let msg = data.text;
			let channelId = data.channelId;
			let channel = this.channelList[channelId] ?? false;
			if (!channel) return;
			channel.sendChat(msg);
		});
		this.socket.on('request', (data) => {
			if (data.type === 'channellist') {
				this.sendChannelList(this.socket, this.tc);
			}
		});
	}
	bindTalkClient() {
		this.tc.on('chat', (data, channel) => {
			try {
				let sender = data.getSenderInfo(channel);
				let name = sender.nickname;
				let msg = data.text ?? '(지원되지 않는 메시지 형태입니다)';
				if (msg === '') {
					msg = '(지원되지 않는 메시지 형태입니다)';
				}
				// this.sendChannelList(this.socket, this.tc);
				this.channelList = this.getChannelList(this.tc);
				this.onMessage(
					this.socket,
					this.tc,
					sender.nickname,
					msg,
					channel.channelId.toString()
				);
			} catch (e) {
				console.log(e);
			}
		});
	}
	onMessage(client, tc, sender, msg, channelId) {
		client.emit('message', { text: msg, sender: sender, channelId: channelId });
	}
	sendChannelList(client, tc) {
		client.emit('data', { type: 'channellist', content: this.getChannelNameList(tc) });
	}
	getChannelNameList(tc) {
		let list = this.getChannelList(tc);
		let ret = {};
		for (let channelId in list) {
			ret[channelId] = this.getChannelName(list[channelId]);
		}
		return ret; // string => string
	}
	getChannelName(channel) {
		let channelName = channel.getDisplayName();
		let userList = channel.getAllUserInfo();
		if (!channelName) {
			let list = [];
			for (let user of userList) {
				list.push(user.nickname);
			}
			channelName = list.join(', ');
		}
		return channelName;
	}
}
module.exports = Client;