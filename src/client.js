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
			if(data.type === 'roomimage'){
				let channelId = data.channelId;
				console.log(this.extractRoomImage(this.channelList[channelId]));
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
	extractRoomImage(channel) {
		let imageUrl = channel.RoomImageURL;
		console.log(channel);
		if (!channel.RoomImageURL) {
			for (let meta in channel.ChannelMetaList) {
				console.log(meta);
				if (meta.type === (require('node-kakao')).ChannelMetaType.PROFILE) {
					const content = JSON.parse(meta.content);
					imageUrl = content.imageUrl;
				}
			}

			if (!imageUrl) {
				imageUrl = '/images/groupprofile.svg';
			}
		}

		return imageUrl;
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