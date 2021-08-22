class Channel extends Serializable {
	//TalkChannel, 
	constructor(talkChannel){
		this.talkChannel = talkChannel;
		this.data.name = this.getDisplayName();
	}
	
	getUserList(){
		let userList = channel.getAllUserInfo();
		let list = [];
		for(let user of userList){
			list.push(user.nickname);
		}
	}
	
	getDisplayName() {
		let channel = this.talkChannel;
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