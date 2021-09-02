class Extractor {
	constructor(tc){
		this.tc = tc;
	}
	getChannelList() {
		let channelList = this.tc.channelList;
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