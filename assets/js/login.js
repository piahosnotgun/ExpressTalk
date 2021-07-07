window.onload = () => {
	document.getElementById('submit').onclick = login;
};
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
		alert('로그인되었습니다.');
	});
}