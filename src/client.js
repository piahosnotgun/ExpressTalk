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
			//프로필 이미지 전송
			if (data.type === 'roomimage') {
				let channelId = data.channelId;
				this.sendChannelImage(this.socket, channelId);
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
		let imageUrl = '/images/default-profile.svg'; // 추후에 업데이트 예정. 그룹 프로필 이미지 고쳐야됨
		//개인채팅인 경우
		let userList = channel.info.displayUserList;
		if (userList.length == 1) {
			if (typeof imageUrl !== 'undefined') {
				imageUrl = userList[0].profileURL;
				if (imageUrl === '' || imageUrl === 'undefined') {
					imageUrl = '/images/default-profile.svg';
				}
			}
		}
		return imageUrl;
	}
	onMessage(client, tc, sender, msg, channelId) {
		client.emit('message', { text: msg, sender: sender, channelId: channelId });
	}
	sendChannelImage(client, channelId) {
		client.emit('data', {
			type: 'roomimage',
			content: this.extractRoomImage(this.channelList[channelId]),
			channelId: channelId,
		});
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