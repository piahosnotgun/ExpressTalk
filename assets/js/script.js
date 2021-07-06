window.onload = () => {
	document.getElementById('submit').onclick = requestPasscode;
};
function requestPasscode() {
	let email = document.getElementById('useremail').innerText;
	let password = document.getElementById('userpwd').innerText;
	let name = document.getElementById('username').innerText;
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
function appendSubmit() {
	let submit = document.createElement('button');
	submit.setAttribute('style', 'text-decoration: none;');
	submit.className = 'btn';
	submit.id = 'submit-button';
	submit.innerText = '인증번호 확인';
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