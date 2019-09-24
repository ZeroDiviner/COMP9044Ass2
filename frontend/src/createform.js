const body = document.getElementsByTagName('body')[0];
import common_alert from './commonAlert.js'

function Createform(param){
	let login = document.createElement('div');  // big login div
	let username_div = document.createElement('div');  // 3 lines for username input
	let username_span = document.createElement('span');
	let input_field = document.createElement('input');
	let password_div = document.createElement('div'); // 3 lines for password input 
	let password_span = document.createElement('span');
	let password_field = document.createElement('input');
	let title = document.createElement('h2'); // title
	let button_click = document.createElement('div');
	let alert_session = document.createElement('h5');
	
	username_span.classList.add('user_span');
	password_span.classList.add('user_span');
	username_div.classList.add('form_user_div');
	if (param.type === 'regist'){
		password_div.classList.add('form_user_div');
	}
	else{
		password_div.classList.add('form_pass_div');
	}
	title.classList.add('form_title');
	
	button_click.id = param.buttonid;
	login.id = param.formid;
	input_field.id = param.userid;
	password_field.id = param.passwordid;
	
	button_click.innerText = param.button;
	username_span.innerText = param.user;
	password_span.innerText = param.pass;
	title.innerText =  param.title;
	
	input_field.setAttribute('placeholder','Please input username');
	password_field.type = 'password';
	password_field.setAttribute('placeholder','Please input password');
	
	login.appendChild(title);
	username_div.appendChild(username_span);
	username_div.appendChild(input_field);
	password_div.appendChild(password_span);
	password_div.appendChild(password_field);
	
	login.appendChild(username_div);
	login.appendChild(password_div);
	if (param.type === 'regist'){
		let again_pass_div = document.createElement('div');
		let again_pass_span = document.createElement('span');
		let again_pass = document.createElement('input');
		let email_div = document.createElement('div');
		let email_span = document.createElement('span');
		let email_field = document.createElement('input');
		let name_div = document.createElement('div');
		let name_span = document.createElement('span');
		let name_field = document.createElement('input');
		
		name_div.classList.add('form_pass_div');
		name_span.classList.add('user_span');
		name_field.setAttribute('placeholder','Your Name');
		name_span.innerText = 'Yourname: ';
		name_field.id = 'registname';
		name_div.appendChild(name_span);
		name_div.appendChild(name_field);
		
		email_div.classList.add('form_user_div');
		email_span.classList.add('user_span');
		email_field.setAttribute('placeholder','Your email address');
		email_span.innerText = 'EmailAddr: ';
		email_field.id = 'emailaddr';
		email_div.appendChild(email_span);
		email_div.appendChild(email_field);
		
		again_pass_div.classList.add('form_user_div');
		again_pass_span.classList.add('user_span');
		again_pass.setAttribute('placeholder',param.againplace);
		again_pass.type = 'password';
		again_pass_span.innerText = param.passagain_text;
		again_pass.id = param.againid;
		again_pass_div.appendChild(again_pass_span);
		again_pass_div.appendChild(again_pass);
		login.appendChild(again_pass_div);
		login.appendChild(email_div);
		login.appendChild(name_div);
		alert_session.id = 'regist_info';
		
	}
	else{
		alert_session.id  = 'login_info';
	}
	login.appendChild(alert_session);
	login.appendChild(button_click);
	body.appendChild(login);
	
}

// create mask behind the login and register form
export default Createform