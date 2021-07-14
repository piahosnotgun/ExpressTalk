class User {
	constructor(socket, tc) {
		this.socket = socket;
		this.tc = tc;
		this.channelList = this.getChannelList(tc);
		this.bind();
		this.sendChannelList(socket, tc);
	}
	bind() {
		this.socket.on('message', (data) => {
			let msg = data.text;
			let channelId = data.channelId;
			let channel = this.channelList[channelId] ?? false;
			if (!channel) return;
			channel.sendChat(msg);
			console.log(msg);
		});
		this.socket.on('request', (data) => {
			if (data.type === 'channellist') {
				this.sendChannelList(this.socket, this.tc);
			}
		});
		this.tc.on('chat', (data, channel) => {
			let sender = data.getSenderInfo(channel);
			let name = sender.nickname;
			let msg = data.text ?? '(지원되지 않는 메시지 형태입니다)';
			// this.sendChannelList(this.socket, this.tc);
			this.channelList = this.getChannelList(this.tc);
			this.onMessage(this.socket, this.tc, sender, msg, channel.id.toString());
		});
	}
	onMessage(client, tc, sender, msg, channelId) {
		client.emit('message', { text: msg, sender: sender, channelId: channelId });
	}
	sendChannelList(client, tc) {
		client.emit('data', { type: 'channellist', content: this.getChannelNameList(tc) });
	}
	getChannelList(tc) {
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
				channelName = list.join(', ');
			}
		}
		return channelName;
	}
}
module.exports = User;