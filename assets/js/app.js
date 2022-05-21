let socket = io();

let cm = new ChatManager(socket);

socket.on('data', (data) => {
	if (data.type === 'channellist') {
		let channelList = data.content;
		cm.updateChannelList(channelList);
		console.log(channelList);
		for(let channelId in channelList){
			cm.requestProfileImage(channelId)
		}
	} else if(data.type === 'roomimage'){
		let channelId = data.channelId;
		console.log('p' + channelId);
		let roomImageElement = document.getElementById('p' + channelId);
		
		let image = data.content;
		roomImageElement.style.backgroundImage = "url('" + image + "')";
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
	document.getElementById('channel-search').oninput = search;
};
function search(e){
	let value = e.target.value;
	if(value === ''){
		cm.reloadListDisplay();
	} else {
		cm.onSearchChannel(value);
	}
}
function press(e){
	if(e.keyCode === 13){
		cm.onSendClick();
	}
}