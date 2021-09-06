window.onload = () => {
	let submit = document.getElementById('submit');
	submit.onclick = login;
	let email = document.getElementById('useremail');
	let pwd = document.getElementById('userpwd');
	email.onkeydown = press;
	pwd.onkeydown = press;
};
function press(e){
	if(window.event.keyCode === 13){
		login();
	}
}
function login(){
	let email = document.getElementById('useremail').value;
	let password = document.getElementById('userpwd').value;
	
	let submit = document.getElementById('submit');
	submit.classList.toggle('running');

	document.getElementById('submit-icon').style.display = 'none';
	document.getElementById('loading').style.display = '';
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