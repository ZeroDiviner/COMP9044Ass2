import API_URL from './backend_url.js';
import common_alert from './commonAlert.js'
const body = document.getElementsByTagName('body')[0];
function init_upload(data){
	// create upload form for basic element
	let token = localStorage.getItem('user_token');
	
	let upload = document.createElement('div');
	
	let title_div = document.createElement('div');
	let text_div = document.createElement('div');
	let sub_div = document.createElement('div');
	let img_div = document.createElement('div');
	let upload_button = document.createElement('button');

	let title = document.createElement('h2');
	
	let title_span = document.createElement('span');
	let text_span = document.createElement('span');
	let sub_span = document.createElement('span');
	let img_span = document.createElement('span');
	
	let title_input = document.createElement('input');
	let text_input = document.createElement('textarea');
	let sub_input = document.createElement('input');
	let img_input = document.createElement('input');
	let input_out_span = document.createElement('span');
	let input_inner_span1 = document.createElement('span');
	let input_inner_span2 = document.createElement('span');
	
	
	//set id for important node
	title_input.id = data.titleid;
	text_input.id = data.textid;
	sub_input.id = data.subid;
	
	//initiate inner text
	title.innerText = data.title;
	title_span.innerText = data.post_title;
	text_span.innerText = data.Text;
	sub_span.innerText = data.Subseddits;
	img_span.innerText = data.upload;
	upload.id = data.formid;
	upload_button.innerText = data.button;
	input_inner_span1.innerText = data.leftText;
	
	//set some style , for a better looking upload file!
	img_input.type = 'file';
	img_input.id = 'select_file'
	input_out_span.style.width = "50%";
	input_inner_span1.style.width = "29%";
	input_inner_span2.style.width = '68%';
	input_out_span.classList.add('outer_span');
	input_inner_span1.id = 'upload_left';
	input_inner_span2.id = 'upload_filename';
	img_input.style.position = 'absolute';
	img_input.style.width = "1px";
    img_input.style.height = "1px";
    img_input.style.clip = 'rect(0,0,0,0)';
    upload_button.id = 'upload_post';
    
	
	// append these node in body
	input_out_span.appendChild(input_inner_span1);
	input_out_span.appendChild(input_inner_span2);
	
	title_div.appendChild(title_span);
	title_div.appendChild(title_input);
	text_div.appendChild(text_span);
	text_div.appendChild(text_input);
	sub_div.appendChild(sub_span);
	sub_div.appendChild(sub_input);
	img_div.appendChild(img_span);
	img_div.appendChild(img_input);
	img_div.appendChild(input_out_span);
	
	upload.appendChild(title);
	upload.appendChild(title_div);
	upload.appendChild(text_div);
	upload.appendChild(sub_div);
	upload.appendChild(img_div);
	upload.appendChild(upload_button);
	body.appendChild(upload);
	
	
	//upload file part (post image)
	let file_input = document.getElementById('select_file')
	input_inner_span1.addEventListener('click',()=>{
		file_input.click();
	})
	
	let post_but = document.getElementsByClassName('button-secondary')[1];
	let mask = document.getElementById('mask');
	post_but.addEventListener('click',()=>{
		let token_new = localStorage.getItem('user_token');
		if (token_new){
			document.getElementById('upload_form').style.display = 'block';
			mask.style.display = 'block';
			let submit_button = document.getElementById('upload_post');
			let type = submit_button.getAttribute('type');
			
			if (type == 'update'){
				submit_button.innerText = 'Update';
				let title = submit_button.getAttribute('update_title');
				let sub = submit_button.getAttribute('update_sub');
				let content = submit_button.getAttribute('update_con');
				let image = submit_button.getAttribute('update_img');
				let id = submit_button.getAttribute('update_id');
				document.getElementById('post_title').value = title;
				document.getElementById('post_content').value = content;
				document.getElementById('post_sub').value = sub;
				if (image!="null"){
					let form = document.getElementById('upload_form');
					let imgdiv = document.createElement('div');
					let preview = document.createElement('span');
					preview.innerText = 'Preview: ';
					preview.classList.add('preview_span');
					preview.style.display = 'block';
					imgdiv.appendChild(preview);
					
		            imgdiv.classList.add('img_div');
		            let img = document.createElement('img');
		            img.id = 'upload_img_self';
		            img.src = "data:image/jpeg;base64,"+image;
		            imgdiv.appendChild(img);
		            form.insertBefore(imgdiv,upload_button);
				}
			}
		}
		else{
			// must login before post something
			common_alert('Login First');
		}
	})
	
	// add a change listener on file, check if user have already upload a file
	file_input.addEventListener('change',(event)=>{
		let right_span = document.getElementById('upload_filename');
		upload_filename.innerText = event.target.files[0].name;
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			let src = fileLoadedEvent.target.result;
			if (document.getElementById('upload_img_self')){
				document.getElementById('upload_img_self').src = fileLoadedEvent.target.result;
			}
			else{
				// allow users to see the image that they upload
				let imgdiv = document.createElement('div');
				let preview = document.createElement('span');
				preview.innerText = 'Preview: ';
				preview.classList.add('preview_span');
				preview.style.display = 'block';
				imgdiv.appendChild(preview);
				
	            imgdiv.classList.add('img_div');
	            let img = document.createElement('img');
	            img.id = 'upload_img_self';
	            img.src = src;
	            imgdiv.appendChild(img);
	            upload.insertBefore(imgdiv,upload_button);
			}
            
       	}
		// change the image file to a base64 string
		fileReader.readAsDataURL(event.target.files[0]);
	})
	
	// click listener for post button
	upload_post.addEventListener('click',(event)=>{
		let usertoken = localStorage.getItem('user_token');
		let type = document.getElementById('upload_post').getAttribute('type');
		// check button value to see if update or post a new content
		event.preventDefault();
		let body = {
			"title":"",
			"text":"",
			"subseddit":'',
			"image":''
		}
		let title = document.getElementById('post_title').value;
		// check if user did inout in all of these fields before fetch
		if (title){
			body.title = title;
		}
		else{
			// check title
			common_alert('Title cannot be empty!');
			return;
		}
		let content = document.getElementById('post_content').value;
		if (content){
			body.text = content;
		}
		else{
			// check desc
			common_alert('Content cannot be empty!');
			return;
		}
		let sub = document.getElementById('post_sub').value;
		if (sub){
			body.subseddit = sub;
		}
		else{
			//check subseddit
			common_alert('Subseddit cannot be empty!');
			return;
		}
		// image can be none
		if (document.getElementById('upload_img_self')){
			let base64 = document.getElementById('upload_img_self').src;
			body.image = base64.replace('data:image/jpeg;base64,','');
		}
		console.log(body);
		
		if (type == "update"){
			//update a already exist post
			console.log(body);
			let update_id = document.getElementById('upload_post').getAttribute('update_id');
			let params = {
				"method":"PUT",
				"headers": {
					"Content-Type":'application/json',
					"Authorization":"Token: "+usertoken,
				},
				"body":JSON.stringify(body)
			}
			let url = API_URL+'/post/?id='+update_id;
			let postfetch = fetch(url,params)
			.then(response=>response.json())
			.then(data=>{
				if(data.message == 'success'){
					common_alert('Update Success!');
					setTimeout(()=>{location.reload()},1500);
				}
			})
		}
		else{
			// post a new content
			let params = {
				"method":"POST",
				"headers": {
					"Content-Type":'application/json',
					"Authorization":"Token: "+usertoken,
				},
				"body":JSON.stringify(body)
			}
			let post_url = API_URL+'/post/';
			let postfetch = fetch(post_url,params)
			.then(response=>response.json())
			.then(data=>{
				// post success!!
				if(data.post_id){
					common_alert('Post successfully!');
					setTimeout(()=>{
	//					document.getElementById('mask').click();
						location.reload();
					},1500);
				}
				else if(data == "Invalid Auth Token"){
					// wrong token ,need to re login
					document.getElementById('mask').click();
					common_alert("Invalid User token !");	
				}
			})
		}
	})
//	let post_but = document.getElementsByClassName('button-secondary')[1];
}
export default init_upload

function scollban(){
	scrollTo(0,0);
}

//function toBase64(file){
//	
//	let filestream = file;
//	console.log(file.height);
//}
