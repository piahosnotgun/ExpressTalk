window.onload = () => {
	let submit = document.getElementById('submit');
	submit.onclick = login;
};
function press(){
	if(window.event.keyCode === 13){
		login();
	}
}
function login(){
	let email = document.getElementById('useremail').value;
	let password = document.getElementById('userpwd').value;
	axios({
		method: 'post',
		url: '/kakao/login',
		data: {
			email: email,
			password: password
		}
	}).then((res)=>{
		let data = res.data;
		if(data.result === 'error'){
			alert(data.message);
			return;
		}
		window.location.href = '/';
	});
}