class Database {
	constructor() {
		this.filename = 'database.json';
		this.fs = require('fs');
		if (!this.fs.existsSync(this.filename)) {
			this.fs.writeFileSync(this.filename, JSON.stringify({}));
			this.data = {};
		} else {
			let read = this.fs.readFileSync(this.filename);
			this.data = JSON.parse(read);
		}
	}
	addData(name, email, uuid) {
		this.data[email] = { name: name, uuid: uuid };
	}
	getData(email, field) {
		return this.data[email][field] ?? false;
	}
	save() {
		this.fs.writeFileSync(this.filename, JSON.stringify(this.data), ()=>{});
	}
}
module.exports = Database;