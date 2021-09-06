const Extractor = require('./utils/extractor.js');
const api = require('node-kakao');
class Client {
	constructor(socket, tc) {
		this.socket = socket;
		this.tc = tc;
		this.extractor = new Extractor(tc);
	}
	extractRoomImage(channel) {
		let imageUrl = channel.RoomImageURL;

		if (!channel.RoomImageURL) {
			channel.ChannelMetaList.forEach((meta) => {
				if (meta.type === api.ChannelMetaType.PROFILE) {
					const content = JSON.parse(meta.content);
					imageUrl = content.imageUrl;
				}
			});

			if (!imageUrl) {
				imageUrl = "/images/groupprofile.svg";
			}
		}

		return imageUrl;
	}
}