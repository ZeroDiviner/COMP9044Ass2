const body = document.getElementsByTagName('body')[0];

// a common tool to alert user something, default alert() function is way too ugly!
function common_alert(message){
	let alert = document.getElementById('alert');
	alert.innerText = message;
	alert.style.display = 'block';
	setTimeout(()=>{
		alert.style.display = 'none';
	},2000)
}
export default common_alert