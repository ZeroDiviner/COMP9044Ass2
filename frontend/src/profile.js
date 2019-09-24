import API_URL from './backend_url.js';
import common_alert from './commonAlert.js'

//this file is to generate user profile modal,and all of part about profile
//(like edit profile or user logout event)
const body = document.getElementsByTagName('body')[0];
function init_profile(data){
	// generate outerdiv for profile
	let profile = document.createElement('div');
	let title = document.createElement('h2');
	let username_div = document.createElement('div');
	let posts_num_div = document.createElement('div');
	let email = document.createElement('div');
	let followed_num = document.createElement('div');
	let following = document.createElement('div');
	let following_list = document.createElement('ul');
	let name = document.createElement('div');
	let upvotes_num = document.createElement('div');
	let button_div = document.createElement('div');
	let posts_list = document.createElement('ul');
	let show_list = document.createElement('div');
	let edit = document.createElement('span');
	let logout = document.createElement('span');
	// create notification area
	let noti_span = document.createElement('span');
	let noti_div = 	document.createElement('div');
	let noti_title = document.createElement('h3');
	let noti_ul = document.createElement('ul');
	let noti_clear = document.createElement('span');
//	let noti_li = document.createElement('li');
	
	noti_div.appendChild(noti_title);
	noti_div.appendChild(noti_ul);
	noti_div.appendChild(noti_clear);
//	noti_ul.appendChild(noti_li);
	
//	noti_li.classList.add('notification_li');
//	noti_li.innerText = 'Noah Just posted new Content!';
	noti_ul.id = 'notification_ul';
	noti_clear.id = 'notification_clear';
	noti_div.id = 'notification_div';
	noti_title.classList.add('noti_title');
	noti_title.innerText = 'Notification';
	noti_clear.innerText = 'Clear';
	//change innertext based on fetched data or initialisation
	title.innerText = 'Profile';
	title.style.textAlign = 'center';
	noti_span.id = 'notification';
	let post_num_span = document.createElement('span');
	post_num_span.classList.add('before');
	post_num_span.innerText = 'Post Number: ';
	let email_span = document.createElement('span');
	email_span.classList.add('before');
	email_span.innerText  = 'Email: ';
	let username_span = document.createElement('span');
	username_span.classList.add('before');
	username_span.innerText = 'Username: ';
	let followed_num_span = document.createElement('span');
	followed_num_span.classList.add('before');
	followed_num_span.innerText = 'Followers: ';
	let following_span = document.createElement('span');
	following_span.classList.add('before');
	following_span.innerText = 'Following: ';
	let name_span = document.createElement('span');
	name_span.classList.add('before');
	name_span.innerText = 'Name: ';
	let upvotes_span = document.createElement('span');
	upvotes_span.classList.add('before');
	upvotes_span.innerText = 'Upvotes Num: ';
	edit.innerText = 'Edit Profile';
	edit.classList.add('profile_button');
	logout.innerText = 'Log Out';
	logout.classList.add('profile_button');
	button_div.classList.add('profile_button_div');
	posts_list.id = 'user_profile_posts_list';
	
	// set it and initial state for this variables
	let post_num_info = document.createElement('span');
	post_num_info.innerText = data.posts.length;
	let email_info = document.createElement('span');
	email_info.innerText = data.email;
	email_info.id = 'editable_email';
	let username_info = document.createElement('span');
	username_info.innerText = data.username;
	let followed_num_info = document.createElement('span');
	followed_num_info.innerText = data.followed_num;
	let following_info = document.createElement('span');
	following_info.innerText = data.following.length;
	let name_info = document.createElement('span');
	name_info.innerText = data.name;
	name_info.id = "editable_name";
	let upvotes_info = document.createElement('span');
 	var up_num = 0;
 	show_list.innerText = 'Show List';
 	// initiate the following list!
	let following_user_list = [];
	let token = localStorage.getItem('user_token');
	for (let i=0;i<data.following.length;i++){
		let url = API_URL+"/user/?id="+data.following[i];
		let param = {
			"method":'GET',
//			"Content-Type":'application/json',
			"headers":{
				"accept": 'application/json',
				"Authorization":" Token: "+token,
			}
			
		}
		following_user_list.push(fetch_data(url,param));
	}
	Promise.all(following_user_list).then(data=>{
		for (let i=0;i<data.length;i++){
			let li = document.createElement('li');
			li.classList.add('profile_following_list');
			let fol_name = document.createElement('span');
			fol_name.innerHTML = data[i].username;
//			let unf_button = document.createElement('span');
			li.appendChild(fol_name);
			
			let varia = data.length<=5?30:60;
			document.getElementById('profile_following_list').style.height = varia + 'px';
			fol_name.setAttribute('name',data[i].username);
			fol_name.addEventListener('mouseenter',()=>{
				fol_name.innerText = 'Unfollow';
			})
			fol_name.addEventListener('mouseleave',(event)=>{
				fol_name.innerText = event.target.getAttribute('name');
			})
			fol_name.addEventListener('click',(event)=>{
				let username = event.target.getAttribute('name');
				let url = API_URL+"/user/unfollow/?username="+username;
				let param = {
					"method":'PUT',
		//			"Content-Type":'application/json',
					"headers":{
						"accept": 'application/json',
						"Authorization":" Token: "+token,
					}
				}
				fetch(url,param)
				.then(response=>response.json())
				.then(data=>{
						if(data.message == 'success'){
							common_alert("Unfollow success!");
							setTimeout(()=>{
								location.reload();
							},1500)
						}
				})
				
			})
//			li.appendChild(unf_button);
			following_list.appendChild(li);
		}
	});
 	
//	upvotes_info.innerText = data.name;
	profile.id = "profile_form";
	logout.id = 'profile_logout';
	edit.id = 'profile_edit';
	show_list.id = 'profile_show_list';
	following_list.id = 'profile_following_list';
	
	show_list.setAttribute('num',data.posts.length);
	//append all of elements created to their parent node and add them to body
	username_div.appendChild(username_span);
	username_div.appendChild(username_info);
	username_div.appendChild(noti_span);
	posts_num_div.appendChild(post_num_span);
	posts_num_div.appendChild(post_num_info);
	email.appendChild(email_span);
	email.appendChild(email_info);
	followed_num.appendChild(followed_num_span);
	followed_num.appendChild(followed_num_info);
	following.appendChild(following_span);
	following.appendChild(following_info);
	name.appendChild(name_span);
	name.appendChild(name_info);
	upvotes_num.appendChild(upvotes_span);
	upvotes_num.appendChild(upvotes_info);
	button_div.appendChild(edit);
	button_div.appendChild(logout);

	
	profile.appendChild(title);
	profile.appendChild(username_div);
	profile.appendChild(posts_num_div);
	profile.appendChild(email);
	profile.appendChild(followed_num);
	profile.appendChild(following);
	profile.appendChild(following_list);
	profile.appendChild(name);
	profile.appendChild(upvotes_num);
	profile.appendChild(show_list);
	profile.appendChild(posts_list);
	profile.appendChild(button_div);
	body.appendChild(profile);
	
	//part below if for edit profile part, to create edit profile small modal
	let editdiv = document.createElement('div');
	let newtitle = document.createElement('h3');
	let newname = document.createElement('div');
	let newemail = document.createElement('div');
	let newpass = document.createElement('div');
	let submit_button = document.createElement('button');
	
	let namespan = document.createElement('span');
	let emailspan = document.createElement('span');
	let passspan = document.createElement('span');
	
	let nameinput = document.createElement('input');
	let emailinput = document.createElement('input');
	let passinput = document.createElement('input');
	passinput.type = 'password';
	
	//set id for the elements in this small modal
	editdiv.id = 'edit_profile';
	nameinput.id = 'edit_name_input';
	emailinput.id = 'edit_email_input';
	passinput.id = 'edit_pass_input';
	submit_button.id = 'edit_submit_input';
	newtitle.innerText = 'New Info';
	namespan.innerText = 'New Name: ';
	emailspan.innerText = 'Email: ';
	passspan.innerText = 'Password: ';
	submit_button.innerText = 'Submit';
	//append all the elements generated to their parent node
	newname.appendChild(namespan);
	newname.appendChild(nameinput);
	newemail.appendChild(emailspan);
	newemail.appendChild(emailinput);
	newpass.appendChild(passspan);
	newpass.appendChild(passinput);
	editdiv.appendChild(newtitle);
	editdiv.appendChild(newname);
	editdiv.appendChild(newemail);
	editdiv.appendChild(newpass);
	editdiv.appendChild(submit_button);
	
	profile.appendChild(editdiv);
	body.appendChild(noti_div);
	
	noti_clear.addEventListener('click',()=>{
		let ul = document.getElementById('notification_ul');
		for(let i=ul.childNodes.length;i>0;i--){
			ul.removeChild(ul.childNodes[i]);
		}
		let empty_list = [];
		localStorage.setItem('push_noti',empty_list);
		document.getElementById('notification').style.display = 'none';
	});
	
	noti_span.addEventListener('click',()=>{
		document.getElementById('mask').click();
		document.getElementById('notification_div').style.display = 'block';
		if(document.getElementById('notification_ul').childNodes.length == 0){
			common_alert('Nothing new!');
			document.getElementById('notification_div').style.display = 'none';
		}
	})
	//add a click listener to the button 'Edit',click to see the small modal
	edit.addEventListener('click',()=>{
		let editpart = document.getElementById('edit_profile');
		let boundary = 225;
		let h =  editpart.clientHeight;
//		 click animation, increase the height of edit form to see the full form, click again to decrease the
//		height of the modal to 0
		if (h==0){
//			animation to increase height
			let t1 =setInterval(()=>{
					if (h < boundary){
						h+=3;
		//				console.log(h);
						editpart.style.height = h + "px";
					}
					else{
						clearInterval(t1);
					}
					
			},10);
		}
		else{
//			animation to decrease the height
			let t1 =setInterval(()=>{
				
				if (h !=0){
					h-=1;
	//				console.log(h);
					editpart.style.height = h + "px";
				}
				else{
					clearInterval(t1);
				}
				
			},3)
		}
		
	});
	let show_list_button = document.getElementById('profile_show_list');
	show_list_button.addEventListener('click',(event)=>{
		let list = document.getElementById('user_profile_posts_list');
		let boundary = 270;
		let posts_no = event.target.getAttribute('num');
//		console.log(posts_no);
		if (posts_no == 0){
			common_alert('Nothing\'s here');
			return;
		}
		let h =  list.clientHeight;
		boundary = posts_no > 2?180:posts_no*90;
		
//		 click animation, increase the height of edit form to see the full form, click again to decrease the
//		height of the modal to 0
		if (h==0){
//			animation to increase height
			let t1 =setInterval(()=>{
					if (h < boundary){
						h+=3;
		//				console.log(h);
						list.style.height = h + "px";
					}
					else{
						clearInterval(t1);
					}
					
			},10);
		}
		else{
//			animation to decrease the height
			let t1 =setInterval(()=>{
				
				if (h !=0){
					h-=1;
	//				console.log(h);
					list.style.height = h + "px";
				}
				else{
					clearInterval(t1);
				}
				
			},3)
		}
	})
	//add click listener to submit button in small modal
	let sub_button = document.getElementById('edit_submit_input');
	sub_button.addEventListener('click',()=>{
		let token = localStorage.getItem('user_token');
		let new_name = document.getElementById('edit_name_input').value;
		let new_email = document.getElementById('edit_email_input').value;
		let new_pass = document.getElementById('edit_pass_input').value;
		//check if user did input something (and must be valid)
		if (new_name || new_email || new_pass){
			// configure to fetch the url
			let url = API_URL+"/user/";
			let body = {};
			if (new_name.trim()) body.name = new_name;
			if (new_email.trim()) body.email = new_email;
			if (new_pass.trim()) body.password = new_pass;
			let param = {
				"method":"PUT",
				"headers": {
					"accept": 'application/json',
					"Authorization":" Token: "+token	,
					"Content-Type":'application/json'
				},
				"body":JSON.stringify(body)
			}
			fetch(url,param)
			.then(response=>response.json())
			.then(data=>{
				if(data.msg == "success"){
					// change information success, alert and then change the profile 
					common_alert("Data updated!");
					if (body.email){
						document.getElementById('editable_email').innerText = body.email;
					}
					if (body.name){
						document.getElementById('editable_name').innerText = body.name;
					}
					// after 1.5 seconds, close the profile and return to homepage
					setTimeout(()=>{
						document.getElementById('mask').click();
					},1500)
					
				}
				else if(data.msg == "Invalid Authorization Token"){
					// data info error, need to login again
					common_alert("login error!");
				}
			})
		}
		else{
			// user did not input anything, don't fetch that url! alert user!
			common_alert('Nothing to commit!');
		}
	})
//	console.log(data.posts.toString());
//	let token = localStorage.getItem('user_token');
	let fetch_array = [];
	//calculate the number of upvotes in all of the user's post, i use promise.all to deal with synchronise problem
	if (data.posts.toString()!=""){
		for(let i=0;i<data.posts.length;i++){
			let urls = API_URL+"/post/?id="+data.posts[i];
			let param = {
				"method":"GET",
				"headers": {
					"Content-Type":'application/json',
					"Authorization":" Token: "+token	
					}
				}	
			fetch_array.push(fetch_data(urls,param));
		}
		Promise.all(fetch_array).then(data=>{
			for (let j=0;j<data.length;j++){
				up_num+=data[j].meta.upvotes.length;
			}
			initiate_user_posts(data,"user_profile_posts_list");
			
			return up_num;
		}).then(data=>{
			// after all the request, change the inner text for upvotes number!
			upvotes_info.innerText = data;
		})
	}
	else{
		// user have never post anything, upvotes among all the posts should be 0
		upvotes_info.innerText = 0;
	}
//	console.log(data.posts);
}
// a common function to genelise returned promise object, used to generate fetch list
function fetch_data(url,param){
	return fetch(url,param).then(response=>response.json());
}
function timetrans(timestamp){
	var pub_time = new Date(timestamp);
	let year = pub_time.getFullYear();
	let month = (pub_time.getMonth()+1 < 10 ? '0'+(pub_time.getMonth()+1) : pub_time.getMonth()+1);
	let day = (pub_time.getDate() < 10 ? '0'+pub_time.getDate() : pub_time.getDate());
	let hour = (pub_time.getHours() < 10 ? '0'+pub_time.getHours() : pub_time.getHours());
	let minute = (pub_time.getMinutes() < 10 ? '0'+pub_time.getMinutes() : pub_time.getMinutes());
	let sec = (pub_time.getSeconds() < 10 ? '0'+pub_time.getSeconds() : pub_time.getSeconds());
	return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+sec;
}
function initiate_user_posts(data,id){
	let ul = document.getElementById(id);
	ul.style.padding = '0';
	// clear previouse posts list before initiate!
	if(ul.childNodes.length){
		for (let i=ul.childNodes.length-1;i>=0;i--){
			console.log(ul.childNodes[i])
			ul.removeChild(ul.childNodes[i]);
		}
	}
	for (let j = 0;j<data.length;j++){
		// create basic element based on data
		let li = document.createElement('li');
		let delete_button = document.createElement('div');
		let update_button = document.createElement('div');
		let upvotes_num = document.createElement('div');
		let content = document.createElement('div');
		let title = document.createElement('h4');
		let desc = document.createElement('p');
		let sub = document.createElement('p');
		let time = document.createElement('p');
		li.appendChild(upvotes_num);
		upvotes_num.classList.add('user_posts_up')
		if (data[j].image){
			// check if create a img
			let img_div = document.createElement('div');
			img_div.classList.add('user_post_img_container');
			let img = document.createElement('img');
			img.src = "data:image/png;base64,"+data[j].image;
			img_div.appendChild(img);
			li.appendChild(img_div);
		}
		upvotes_num.innerText = data[j].meta.upvotes.length;
		// 2 button, delet and update post in profile
		delete_button.innerText  = "Delete";
		update_button.innerText  = "Update";
		// set 2 attributes for these 2 buttons, used for id in fetch
		delete_button.setAttribute('post_id',data[j].id);
		update_button.setAttribute('post_id',data[j].id);
		update_button.setAttribute('post_title',data[j].title);
		update_button.setAttribute('post_content',data[j].text);
		update_button.setAttribute('post_sub',data[j].meta.subseddit);
		update_button.setAttribute('post_img',data[j].image);
		
		delete_button.classList.add('delete_post');
		update_button.classList.add('update_post');
		title.innerText = data[j].title;
		desc.innerText = data[j].text;
		sub.innerText = "Subseddit: "+data[j].meta.subseddit;
		time.innerText = timetrans(data[j].meta.published*1000);
		content.appendChild(title);
		content.appendChild(desc);
		content.appendChild(sub);
		content.appendChild(time);
		li.appendChild(content);
		li.appendChild(delete_button);
		li.appendChild(update_button);
		desc.classList.add('userpost_desc_p')
		li.classList.add('user_posts');
		li.style.position = 'relative';
		// when mouse enter the post in profile, show delete and update button
		li.addEventListener('mouseenter',()=>{
			delete_button.style.display = 'block';
			update_button.style.display = 'block';
		});
		// when mouse leave the post in profile, hide delete and update button
		li.addEventListener('mouseleave',()=>{
			delete_button.style.display = 'none';
			update_button.style.display = 'none';
		})
		// delete button listener,remove a post
		delete_button.addEventListener('click',(event)=>{
			let post_id = event.target.getAttribute('post_id');
			let token = localStorage.getItem('user_token');
			let url = API_URL+'/post/?id='+post_id;
			let param = {
				'method':'DELETE',
				"headers": {
					"Content-Type":'application/json',
					"Authorization":" Token: "+token	
				}
			};
			fetch(url,param)
			.then(response=>response.json())
			.then(data=>{
				if(data.message == 'success'){
					common_alert('Delete Success!');
					setTimeout(()=>{
						location.reload();
					},1500);
				}
			})
		});
		// update button listener, update a post
		update_button.addEventListener('click',(event)=>{
			let post_id = event.target.getAttribute('post_id');
			let post_image = event.target.getAttribute('post_img');
			let post_title = event.target.getAttribute('post_title');
			let post_con = event.target.getAttribute('post_content');
			let post_sub = event.target.getAttribute('post_sub');
			document.getElementById('mask').click();
			let updates = document.getElementById('upload_post');
			updates.setAttribute('type','update');
			updates.setAttribute('update_id',post_id);
			updates.setAttribute('update_sub',post_sub);
			updates.setAttribute('update_title',post_title);
			updates.setAttribute('update_con',post_con);
			updates.setAttribute('update_img',post_image);
			document.getElementsByClassName('button-secondary')[1].click();
			
		});
		
		ul.appendChild(li);
	}
	
}
export default init_profile