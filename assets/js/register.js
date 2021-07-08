window.onload = () => {
	document.getElementById('submit').onclick = requestPasscode;
};
function requestPasscode() {
	let email = document.getElementById('useremail').value;
	let password = document.getElementById('userpwd').value;
	let name = document.getElementById('username').value;
	axios({
		method: 'post',
		url: '/kakao/register',
		data: {
			email: email,
			password: password,
			name: name,
		},
	}).then((res) => {
		let data = res.data;
		if (data.result === 'failed') {
			alert(data.message);
			return;
		}
		let submit = document.getElementById('submit');
		submit.className += ' btn-disabled';
		submit.innerText = '인증번호가 요청되었습니다.';
		appendInput();
		appendSubmit();
	});
}
function register() {
	let passcode = document.getElementById('passcode').value.toString();
	if (! isValidCode(passcode)) {
		alert('인증번호는 4자리의 숫자여야 합니다.');
		return;
	}
	axios({
		method: 'post',
		url: '/kakao/passcode',
		data: {
			passcode: passcode
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
function isValidCode(code) {
	if(code.length !== 4)
		return false;
	for (let i = 0; i < code.length; i++) {
		if (isNaN(parseInt(code[i]))) {
			return false;
		}
	}
	return true;
}
function appendSubmit() {
	let submit = document.createElement('button');
	submit.setAttribute('style', 'text-decoration: none;');
	submit.className = 'btn';
	submit.id = 'passcode-submit';
	submit.innerText = '인증번호 확인';
	submit.onclick = register;
	document.getElementById('register-form').appendChild(submit);
}
function appendInput() {
	let passcode = document.createElement('input');
	passcode.setAttribute('type', 'number');
	passcode.className = 'auth-input';
	passcode.id = 'passcode';
	passcode.setAttribute('placeholder', '네자리 숫자 입력');
	passcode.setAttribute('maxlength', 4);
	document.getElementById('register-form').appendChild(passcode);
}