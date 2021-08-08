let socket = io();
let channelList = {};
let currentChannel = ''; //id
socket.on('data', (data) => {
	if (data.type === 'channellist') {
		channelList = data.content;
		console.log(data);
		updateRoom();
	}
});
socket.on('message', (data) => {
	let msg = data.text;
	let sender = data.sender;
	let channelId = data.channelId;
	console.log(channelId + ' ' + sender + ' ' + msg);
});
window.onload = () => {
	let msgElement = document.getElementById('chatinput');
	let btn = document.getElementById('sendchat');
	btn.onclick = () => {
		let msg = msgElement.value;
		if(msg ==='')
			return;
		msgElement.value = '';
		sendMessage(msg, currentChannel);
	};
};
function updateRoom() {
	for (let channelId in channelList) {
		let chatListDisplay = document.getElementById('chatlistdisplay');
		let channel = document.createElement('button');
		channel.classList.add('chat');
		let channelName = document.createTextNode(channelList[channelId]);
		channel.id = channelId;
		channel.appendChild(channelName);
		channel.onclick = function (){
			currentChannel = this.id;
			console.log('채널 변경 : ' + currentChannel);
		}
		chatListDisplay.appendChild(channel);
	}
}
function sendMessage(msg, channelId) {
	socket.emit('message', { text: msg, channelId: channelId });
}
function requestChannelList() {
	socket.emit('request', { type: 'channelList' });
}