let socket = io();
let channellist = {};
let currentChannel = ""; //id
socket.on('data', (data) => {
	if(data.type === 'channellist'){
		this.channellist = data.content;
		console.log(data);
	}
});
socket.on('message', (data)=>{
	let msg = data.text;
	let sender = data.sender;
	let channelId = data.channelId;
	console.log(channelId + " " + sender + " " + msg);
});
window.onload = () =>{
	let msgElement = document.getElementById('chatinput');
	let btn = document.getElementById('sendchat');
	btn.onclick = ()=>{
		let msg = msgElement.value;
		msgElement.value = "";
		socket.emit('message', {message: msg});
	}
}
function sendMessage(msg, channelId){
	socket.emit('message', {text: msg, channelId: channelId});
}
function requestChannelList(){
	socket.emit('request', {type: 'channellist'});
}