let socket = io();
let channelList = {};
let currentChannel = ''; //id

let chatroom = null;

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
	if(channelId === currentChannel){
		handleReceivedMessage(sender, msg);
	}
});
window.onload = () => {
	let msgElement = document.getElementById('chatinput');
	let btn = document.getElementById('sendchat');
	chatroom = document.getElementById('chatroomdisplay');
	btn.onclick = () => {
		let msg = msgElement.value;
		if(msg ==='')
			return;
		msgElement.value = '';
		sendMessage(msg, currentChannel);
	};
};
function handleSelfMessage(msg){
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
}
function handleReceivedMessage(sender, msg){
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
}
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
	handleSelfMessage(msg);
}
function requestChannelList() {
	socket.emit('request', { type: 'channelList' });
}