//global cm = obj ChatManager
class ChatManager {
	constructor(socket) {
		this.socket = socket;
		this.channels = {};
		this.chatData = {};
		this.currentChannel = '';
		this.SELF = ' selfMessage_ ';
	}
	bindSendButton() {
		let btn = document.getElementById('sendchat');
		btn.onclick = this.onSendClick;
	}
	searchUpdate(list){
		this.updateListDisplay(list);
	}
	onSearchChannel(keyword) {
		let ret = {};
		for(let channelId in this.channels){
			let channelName = this.channels[channelId];
			if(typeof(channelName.split(keyword)[1]) !== 'undefined'){
				ret[channelId] = channelName;
			}
		}
		this.searchUpdate(ret);
		return ret;
	}
	onSendClick() {
		let msgElement = document.getElementById('chatinput');
		let msg = msgElement.value;
		if (msg === '') return;
		msgElement.value = '';
		cm.sendMessage(cm.currentChannel, msg);
	}
	changeChannel(channelId) {
		let chatroom = document.getElementById('chatroom');
		chatroom.innerHTML = '';
		if (
			typeof this.chatData[channelId] === 'undefined' ||
			this.chatData[channelId].length <= 0
		) {
			return;
		}
		let data = this.chatData[channelId];
		for (let i = 0; i < data.length; i++) {
			let chat = data[i];
			if (chat.sender === this.SELF) {
				this.handleSelfMessage(chat.message);
			} else {
				this.handleReceivedMessage(chat.sender, chat.message);
			}
		}
		this.scrollBottom();
	}
	scrollBottom() {
		let chatroom = document.getElementById('chatroom');
		chatroom.scrollTo(0, chatroom.scrollHeight);
	}
	updateChannelList(data) {
		this.channels = data;
		for (let id in this.channels) {
			if (typeof this.chatData[id] === 'undefined') {
				this.chatData[id] = [];
			}
		}
		this.updateListDisplay(data);
	}
	reloadListDisplay(){
		this.updateListDisplay(this.channels);
	}
	updateListDisplay(data) {
		if(data.length === 0){
			chatListDisplay.innerHTML = '';
			return;
		}
		let chatListDisplay = document.getElementById('channellist');
		chatListDisplay.innerHTML = '';
		for (let channelId in data) {
			// UI 업데이트
			let channel = document.createElement('div');
			channel.classList.add('channel');
			let profileImage = document.createElement('div');
			profileImage.classList.add('profile-image');
			profileImage.id = 'p' + channelId;
			channel.appendChild(profileImage);
			let button = document.createElement('button');
			let cName = this.channels[channelId];
			if(cName.length > 25){
				cName = cName.substring(0, 25);
				cName += "...";
			}
			let channelName = document.createTextNode(cName);
			
			
			button.id = channelId;
			button.appendChild(channelName);
			
			button.onclick = function () { // 클릭 시 채팅방 변경 바인딩
				if (cm.currentChannel === this.id) return;
				cm.currentChannel = this.id;
				console.log('채널 변경 : ' + cm.currentChannel);
				cm.changeChannel(this.id);
				document.getElementById('chattitle').innerText = cName;
				for (let cid in cm.channels) {
					let cbtn = document.getElementById(cid);
					if (cbtn.classList.contains('focus')) cbtn.classList.remove('focus');
				}
				this.classList.add('focus');
			};
			
			channel.appendChild(button);
			chatListDisplay.appendChild(channel);
		}
	}
	onMessage(channelId, sender, message) {
		if (typeof this.channels[channelId] === 'undefined') {
			this.requestChannelList();
		}
		this.appendChatData(channelId, sender, message);
		if (channelId === this.currentChannel) this.handleReceivedMessage(sender, message);
	}
	requestChannelList() {
		this.socket.emit('request', { type: 'channellist' });
	}
	requestProfileImage(channelId){
		this.socket.emit('request', { type: 'roomimage', channelId: channelId})
	}
	sendMessage(channelId, msg) {
		this.socket.emit('message', { text: msg, channelId: channelId });
		this.appendChatData(channelId, this.SELF, msg);
		this.handleSelfMessage(msg);
	}
	appendChatData(id, sender, message) {
		// 새로 업데이트된 채팅방의 채팅 데이터 init
		if (typeof this.chatData[id] === 'undefined') {
			this.chatData[id] = []; // {channelId: str, sender: str, message: str}
		}
		this.chatData[id].push({ channelId: id, sender: sender, message: message });
	}

	handleSelfMessage(msg) {
		let chatroom = document.getElementById('chatroom');
		let container = document.createElement('div');
		container.classList.add('self');
		let sender = document.createElement('p');
		sender.appendChild(document.createTextNode('You'));
		sender.classList.add('sender');
		let balloon = document.createElement('div');
		let message = document.createElement('p');
		message.appendChild(document.createTextNode(msg));
		balloon.classList.add('balloon');
		message.classList.add('message');
		balloon.appendChild(message);
		container.appendChild(sender);
		container.appendChild(balloon);
		chatroom.appendChild(container);

		this.scrollBottom();
	}

	handleReceivedMessage(sender, msg) {
		let chatroom = document.getElementById('chatroom');
		let container = document.createElement('div');
		container.classList.add('received');
		let s = document.createElement('p');
		s.appendChild(document.createTextNode(sender));
		s.classList.add('sender');
		let balloon = document.createElement('div');
		let message = document.createElement('p');
		message.appendChild(document.createTextNode(msg));
		balloon.classList.add('balloon');
		message.classList.add('message');
		balloon.appendChild(message);
		container.appendChild(s);
		container.appendChild(balloon);
		chatroom.appendChild(container);

		this.scrollBottom();
	}
}