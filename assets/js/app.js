let socket = io();

let cm = new ChatManager(socket);

socket.on('data', (data) => {
	if (data.type === 'channellist') {
		let channelList = data.content;
		cm.updateChannelList(channelList);
		console.log(channelList);
	}
});
socket.on('message', (data) => {
	let msg = data.text;
	let sender = data.sender;
	let channelId = data.channelId;
	cm.onMessage(channelId, sender, msg);
});
window.onload = () => {
	cm.bindSendButton();
	document.getElementById('chatinput').onkeydown = press;
};
function press(e){
	if(e.keyCode === 13){
		cm.onSendClick();
	}
}