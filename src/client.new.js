class Client {
	constructor(socket, tc){
		this.socket = socket;
		this.tc = tc;
		this.extractor = new require('./utils/extractor.js')(tc);
	}
}