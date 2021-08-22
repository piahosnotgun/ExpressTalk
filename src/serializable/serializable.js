class Serializable {
	constructor(){
		this.data = {};
	}
	stringify(){
		return JSON.stringify(this.data);
	}
}