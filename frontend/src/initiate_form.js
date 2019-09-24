import ContentData from './content_data.js';
import Createform from './createform.js';
import init_profile from './profile.js';
import init_upload from './upload.js';
import common_alert from './commonAlert.js'
import API_URL from './backend_url.js';

// this is the main file used to initialise all the things

const body = document.getElementsByTagName('body')[0];

// function that will be exported
function init_form(){
//	document.getElementsByTagName('html')[0].setAttribute('manifest',"file.appcache");
	ClearRoot();
	initRoot();
	Createmask(); // create the mask, will show up when any of modal show up
	Createform(ContentData.login_content); // create login form
	Createform(ContentData.regist_content); // create regist form
	init_post(); // initiate the post based on current state(login or not)
	init_upload(ContentData.upload_content); // initiate the modal for publish a new post
	search_init(); // initiate search logo
	event_bind(); // used to bind event listener in this function
	setInterval(setTimeCheck,3000);
}

function ClearRoot(){
	let root = document.getElementById('root');
//	console.log(root.childNodes);
	for(let i = root.childNodes.length;i>0;i--){
		if(root.childNodes[i]){
			root.removeChild(root.childNodes[i]);
		}
		
	}
	
}


function initRoot(){
	
	let root = document.getElementById('root');
	let header = document.createElement('header');
	header.classList.add('banner');
	header.id = "nav";
	let h1 = document.createElement('h1');
	h1.id = 'logo';
	h1.classList.add("flex-center");
	h1.innerText = 'Seddit';
	header.appendChild(h1);
	let ul = document.createElement('ul');
	ul.classList.add('nav');
	header.appendChild(ul);
	let li1 = document.createElement('li');
	let search = document.createElement('input');
	search.type = 'search';
	search.placeholder = 'Search Seddit';
	search.id = 'search';
	search.dataset.idSearch = "";
	li1.appendChild(search);
	let li2 = document.createElement('li');
	let login = document.createElement('button');
	login.dataset.idLogin = "";
	login.classList.add('button');
	login.classList.add("button-primary");
	login.innerText = 'Log In';
	li2.appendChild(login);
	let li3 = document.createElement('li');
	let signup = document.createElement('button');
	signup.dataset.idSignup = "";
	signup.classList.add('button');
	signup.classList.add('button-secondary');
	signup.innerText = "Sign Up";
	li3.appendChild(signup);
	ul.appendChild(li1);
	ul.appendChild(li2);
	ul.appendChild(li3);
	li1.classList.add('nav-item');
	li2.classList.add('nav-item');
	li3.classList.add('nav-item');
	root.appendChild(header);
	let main = document.createElement('main');
	
	main.role = 'main';
	let feed = document.createElement('ul');
	feed.dataset.idFeed = "";
	feed.id = 'feed'
	let feedHeader = document.createElement('div');
	feedHeader.classList.add("feed-header");
	let h3 = document.createElement('h3');
	h3.classList.add('feed-title');
	h3.classList.add('alt-text');
	h3.innerText = "Popular posts";
	let post = document.createElement('button');
	post.classList.add('button');
	post.classList.add('button-secondary');
	post.innerText = 'Post';
	main.appendChild(feed);
	feed.appendChild(feedHeader);
	feedHeader.appendChild(h3);
	feedHeader.appendChild(post);
	root.appendChild(main);
	let footer = document.createElement('footer');
	let p = document.createElement('p');
	p.innerText = "Seddit example";
	footer.appendChild(p);
	root.appendChild(footer);
}



//before initialise the post, clear all the post first!
function clearAll(){
	let ul = document.getElementById('feed');
	let li = document.getElementsByClassName('post');
//	let ul = li[0].parentNode;
	for (let i = li.length-1;i >=0; i--){
		li[i].parentNode.removeChild(li[i]);
	}
	if(ul){
		for (let i=ul.childNodes.length;i>1;i--){
			if (ul.childNodes[i]){
				ul.removeChild(ul.childNodes[i]);
			}
		}
	}
	
}
function init_post(){
	
	clearAll(); // before initiate ,clear all the post now
//	const postlist = fetch('../data/feed.json')
	localStorage.setItem("Searching","");
	let token = localStorage.getItem('user_token'); 
	
	// if token is not exist, fetch from /post/public
	if (token == ""){
		const postlist = fetch(API_URL+'/post/public')
						.then(response => response.json())
						.then(data => {
							data = data.posts;
							data = data.sort(function(x,y){
								return y.meta.published - x.meta.published;
							});
							for (let i = 0;i< data.length; i ++){
								create_post(data[i],0);
							}
						});
	}
	//token exist, fetch from user/feed, default p and n is 0 and 10
	// n and p is global variable, used for future fetch
	else{
		fetchUser_info_set(token,0);
		let login_post_p = 0;
		let login_post_n = 10;
		localStorage.setItem('login_post_p',login_post_p);
		localStorage.setItem('login_post_n',login_post_n);
		let url = API_URL+'/user/feed?p='+login_post_p+'&n='+login_post_n;
		let pro_param = {
			"method":"GET",
			"headers": {
				"Content-Type":'application/json',
				"Authorization":" Token: "+token	
			}
		}
		let login_post = fetch(url,pro_param)
		.then(response => response.json())
		.then(data =>{
//			console.log(data);
			clearAll();  
			login_post_p+=10;
			for (let i = 0;i< data.posts.length; i ++){
				create_post(data.posts[i],0);
			}
		})
	}
	let login_button = document.getElementById('signin_button');
	let regist_button = document.getElementById('regist_button');
	login_button.addEventListener('click',login); // bind login event to that login button
	regist_button.addEventListener('click',regist); // bind regist event to regist button
}

//things that will happen after click login
function login(){
	let username = document.getElementById('signin_username').value;
	let password = document.getElementById('signin_password').value;
	//message and username cannot be empty
	if ( ! (username && password)){
		showmessage('login_info','Username/password cannot be empty');
	}
	else{
		//configuration for the fetch
		let param = {
			"username":username,
			"password":password
		}
		let url = API_URL+'/auth/login';
		let pro_param = {
			"method":"POST",
			"headers": { 'Content-Type': 'application/json'},
			"body": JSON.stringify(param)
		}
		
		let login_req = fetch(url,pro_param)
					.then(response => response.json())
					.then(data=>{
//						console.log(data);
						//login success, keep this token and reinitialise the login form
						if(data.token){
							localStorage.setItem('user_token',data.token);
							document.getElementById('mask').click();
							document.getElementById('signin_username').value = "";
							document.getElementById('signin_password').value = "";
							return data.token
						}
						else if (data.message){
							// login error, throw a error
							showmessage('login_info','Invalid Username/password');
							throw Error (data.message);
						}
						else{
							// login error, throw a error
							showmessage('login_info','Unhandled error');
							throw Error ('unhandled error');
						}
					})
					.catch(err=>console.log(err))
					.then(data=>{
						if (data){
							//after get user token ,fetch the user posts
							var login_post_p = 0; // initial number of start 
							var login_post_n = 10; // initial number of fetching number
							let url = API_URL+'/user/feed?p='+login_post_p+'&n='+login_post_n;
							let pro_param = {
								"method":"GET",
								"headers": {
									"Content-Type":'application/json',
									"Authorization":" Token: "+data	
								}
							}
							
							let login_post = fetch(url,pro_param)
							.then(response => response.json())
							.then(data =>{
								// before add all the posts inthe homepage, clear all first
								clearAll();
								for (let i = 0;i< data.posts.length; i ++){
									create_post(data.posts[i],0);
								}
							}).then(()=>{
								let token = localStorage.getItem('user_token');
								fetchUser_info_set(token,0); // this function is to fetch user data
							})
						}
					})
		}
	
}

//function to  fetch userdata  based on user data
function fetchUser_info_set(token,id){
	let url = API_URL+'/user/';
	let param = {
		"method":"GET",
		"headers": {
			"Content-Type":'application/json',
			"Authorization":" Token: "+token	
		}
	}
	
	let userinfo = fetch(url,param)
				   .then(response=>response.json())
				   .then(data=>{
				   		init_profile(data); // set the user profile
//				   		console.log(data);
						
				   		profile_bind(); // set the user profile event
//				   		console.log(data);
						//fetch data success, store all of the user information
						localStorage.setItem('userid',data.id);
				   		localStorage.setItem('username',data.username);
						localStorage.setItem('email',data.email);
						localStorage.setItem('name',data.name);
						localStorage.setItem('follow_list',JSON.stringify(data.following));
						// after login, the login button and regist button should be gone;
						let nav = document.getElementsByClassName('nav')[0];
						let li = document.createElement('li');
						document.getElementsByClassName('button-primary')[0].style.display = 'none';
						document.getElementsByClassName('button-secondary')[0].style.display = 'none';
						
						li.innerText = 'Hello! '+data.name;
						li.classList.add('nav-item');
						li.classList.add('profile');
						nav.appendChild(li);
						show_profile();
				   }).catch(err=>console.log(err));
}

// things that will happen after user click regist
function regist(){
	let username = document.getElementById('regist_username');
	let pass = document.getElementById('regist_password');
	let again = document.getElementById('pass_again');
	let email = document.getElementById('emailaddr');
	let name = document.getElementById('registname');
	//regex to check the format of email
	let pass_reg = /^[a-zA-Z]+[a-zA-Z0-9_]{3,}/;
	let username_reg = /^[a-zA-Z]+[a-zA-Z_]{1,}/;
	let email_reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if ( username.value && pass.value && again.value && email.value && name.value){
		//show message display a message in the modal window
		if (pass.value !== again.value){showmessage('regist_info',"Two password are different!"); return;} 
		if (!email_reg.test(email.value)){showmessage('regist_info',"Invalid email format!"); return;}
		if (!pass_reg.test(pass.value)){showmessage('regist_info',"Password should start with letter,least length is 4"); return;}
		if (!username_reg.test(username.value)){showmessage('regist_info',"Username least length is 2,contains only letter and underline"); return;}
		let url = API_URL+'/auth/signup';
		let param = {
			"username":username.value,
			"password":pass.value,
			"email":email.value,
			"name":name.value
		}
		let pro_param = {
			"method":"POST",
			"headers": {
				"Content-Type":'application/json'
			},
			"body": JSON.stringify(param)
		}
		let regist_request = fetch(url,pro_param)
							.then(response => response.json())
							.then(data=>{
								// login successful, display message and then close the modal
								if (data.token){
									document.getElementById('regist_username').value = "";
									document.getElementById('regist_password').value = "";
									document.getElementById('pass_again').value = "";
									document.getElementById('emailaddr').value = "";
									document.getElementById('registname').value = "";
									document.getElementById('regist_info').innerText = "Sign Up success!";
									document.getElementById('regist_info').style.display = 'block';
									setTimeout(()=>{
										document.getElementById('regist_info').innerText = "";
										document.getElementById('regist_info').style.display = 'none';
										document.getElementById('mask').click();
									},1500);
									localStorage.setItem('user_token',data.token);
//									fetchUser_info_set(data.token,0);
									init_post();
								}
								else if (data.message === "Username Taken"){
									// username already been used, false
									showmessage('regist_info',"Username Taken");
									throw Error('Username Taken');
								}
								else if (data.message === "Malformed Request"){
									// message format wrong, report error
									showmessage('regist_info',"Malformed Request");
									throw Error('Malformed Request');
								}
							}).catch(err=>{
								console.log(err);
							})
	}
	else{
		// make sure that user input all of the info in that modal
		if (! username.value) {showmessage('regist_info','Username'+' cannot be empty'); return;}
		if (! pass.value) {showmessage('regist_info','Password'+' cannot be empty');return;}
		if (! again.value) {showmessage('regist_info','Confirm password'+' cannot be empty');return;}
		if (! email.value) {showmessage('regist_info','Email'+' cannot be empty');return;}
		if (! name.value) {showmessage('regist_info','Name'+' cannot be empty');return;}
	}
}

// a common function in modal window to show error/success message
function showmessage(id,message){
	let area = document.getElementById(id);
	area.innerText = message;
	area.style.display = 'block';
}

// common function to create a post based on data given
function create_post(data,searching){
//	console.info(data)
	// create base element in a post
	let ul = document.getElementById('feed');
	let li = document.createElement('li');
	let vote = document.createElement('div');
	let h_3 = document.createElement('h3');
	let content = document.createElement('div');
	let h_4 = document.createElement('h6');
	let p = document.createElement('p');
	let p_time = document.createElement('p');
	let comments = document.createElement('span');
	let theme = document.createElement('span');
	let pub_time = timetrans(data.meta.published * 1000);
	
	//set id ,classname and innertext based on data
	li.classList.add('post');
	li.dataset.idPost = data.id;
	
	comments.classList.add('comments');
	comments.id = 'comments'+data.id;
	theme.classList.add('theme');
	
	content.classList.add('content');
	h_4.classList.add('post-title','alt-text');
	h_4.dataset.idTitle = data.title;
	h_4.innerText = data.text;
	h_3.innerText = data.title;
	p.classList.add('post-author');
	p.dataset.idAuthor = data.meta.author;
	
	p.innerText = "Posted by @"+data.meta.author;
	// add click listener to author to see author information
	p.addEventListener('click',(event)=>{
		let token = localStorage.getItem('user_token');
		if (token){
			let url = API_URL+'/user/?username='+event.target.dataset.idAuthor;
			let param = {
					"method":"GET",
					"headers": {
						"Content-Type":'application/json',
						"Authorization":"Token: "+token,
					},
			}
			fetch(url,param)
			.then(response=>response.json())
			// get user info, return post list to initialise posts in the next then()
			.then(data=>{
				if(data.id){
//					console.log(data);
					initiate_user_info(data,ContentData.user_information);
					return data.posts
				}
				else{
					common_alert('Invalid user info');
				}
			})
			// get posts list
			.then(data=>{
				let fetch_list = [];
				let token = localStorage.getItem('user_token');
				for (let i=0;i<data.length;i++){
					let url = API_URL+'/post/?id='+data[i];
					let param = {
						"method":"GET",
						"headers": {
							"Content-Type":'application/json',
							"Authorization":"Token: "+token,
							},
					};
					fetch_list.push(fetch_data(url,param));
				}
				Promise.all(fetch_list)
				.then(data=>{
					// initialise the information modal
					initiate_user_posts(data,"user_infomation_postlist");
				})
				.then(()=>{
					// mask show and ban scroll event
					document.getElementById('mask').style.display = 'block';
					window.addEventListener('scroll',scollban);
				})
			})
		}
		else{
			// user have not login, not allowed to see the modal
			common_alert('Please login first!');
		}
	});
	p_time.innerText = pub_time;
	comments.innerText = "Comments("+data.comments.length+")";
	theme.innerText = "Subseddit:"+data.meta.subseddit;
	
	p_time.classList.add('post-time');
	vote.classList.add('vote');
	vote.dataset.idUpvotes = data.meta.upvotes.length;
	let temp = upvote_list(data.meta,vote,li,data.id,vote);
	vote.innerText  = data.meta.upvotes.length;

//	vote.style.lineHeight = content.clientHeight;
//  append child to feed element
	content.appendChild(h_3);
	content.appendChild(h_4);
	content.appendChild(p);
	content.appendChild(p_time);
	content.appendChild(comments);
	content.appendChild(theme);
	li.appendChild(vote);
	li.appendChild(content);	
	if (searching !=0){
		console.log('here!!!');
		if (data.meta.author == searching ||
			data.meta.subseddit == searching||
			data.title == searching){
				ul.appendChild(li);
////				console.log("here!!");
			}
			else{
				console.log("Cannot create!!");
			}
	}else{
		ul.appendChild(li);
	}
	
	//initiate comment list based on post info
	comment_list(data.comments,ul,li,comments);
	if (data.image){
		let img_container = document.createElement('div');
		let img = document.createElement('img');
		let base = "data:image/png;base64,";
 		img.src = base+data.image;
 		img.classList.add('post-img');
 		img_container.appendChild(img);
 		//this height is result of calculation, for better look!
   		img_container.style.height = 151 + "px"; // 151 is the result of computation
   		img_container.style.width = 151 + "px";  // 151 is the result of computation
// 		console.log(li.clientWidth);
   		li.insertBefore(img_container,content);
	}
	vote.style.lineHeight = li.clientHeight + "px";
	temp.style.height = li.clientHeight + "px";
//	temp.style.display = "none";
//	setTimeout(()=>{document.getElementsByClassName('upvote_list').style.height = li.clientHeight + "px";},1000);
}

//this id paramater is the parent node that will append post to ,so this part can be reused
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
	// create posts in the  infomation modal
	for (let j = 0;j<data.length;j++){
		let li = document.createElement('li');
		let upvotes_num = document.createElement('div');
		let content = document.createElement('div');
		let title = document.createElement('h4');
		let desc = document.createElement('p');
		let sub = document.createElement('p');
		let time = document.createElement('p');
		li.appendChild(upvotes_num);
		upvotes_num.classList.add('user_posts_up')
		if (data[j].image){
			let img_div = document.createElement('div');
			img_div.classList.add('user_post_img_container');
			let img = document.createElement('img');
			img.src = "data:image/png;base64,"+data[j].image;
			img_div.appendChild(img);
			li.appendChild(img_div);
		}
		upvotes_num.innerText = data[j].meta.upvotes.length;
		title.innerText = data[j].title;
		desc.innerText = data[j].text;
		sub.innerText = "Subseddit: "+data[j].meta.subseddit;
		time.innerText = timetrans(data[j].meta.published*1000);
		content.appendChild(title);
		content.appendChild(desc);
		content.appendChild(sub);
		content.appendChild(time);
		li.appendChild(content);
		desc.classList.add('userpost_desc_p')
		li.classList.add('user_posts');
		ul.appendChild(li);
	}
	
}

// initialise of change the content in the user information modal
function initiate_user_info(data,text){
	if(document.getElementById('user_infomation')){
		document.getElementById('user_infomation_name').innerText = data.username;
		document.getElementById('user_infomation_followed').innerText = data.followed_num;
		document.getElementById('user_infomation_following').innerText = data.following.length;
		document.getElementById('user_infomation_postnum').innerText = data.posts.length;
		document.getElementById('keep_posts_num').setAttribute('postnum',data.posts.length);
		document.getElementById('user_infomation').style.display = 'block';
		let follow_button = document.getElementById('follow');
		let followlist = JSON.parse(localStorage.getItem('follow_list'));
		follow_button.setAttribute('follow_id',data.id);
		follow_button.setAttribute('follow_name',data.username);
		let follow_flag = 0;
	//			console.log(data);
	// based on the follow condition, initiate follow button text
		for (let i=0;i<followlist.length;i++){
			if(followlist[i] == data.id){
				follow_flag = 1;
				break
			}
		}
		if (follow_flag == 1){
			follow_button.innerText = 'Following';
		}
		else{
			follow_button.innerText = 'Follow';
		}
	}
	else{
		//outer div for user information
		let user_info_div = document.createElement('div');
		let user_name_div = document.createElement('div');
		let user_followed_div = document.createElement('div');
		let user_following_div = document.createElement('div');
		let post_num_div = document.createElement('div');
		let post_list_div = document.createElement('div');
		
		// inner label element
		let user_name_span = document.createElement('span');
		let user_followed_span = document.createElement('span');
		let user_following_span = document.createElement('span');
		let post_num_span = document.createElement('span');
		let post_list_span = document.createElement('span');
		
		//inner information element
		let name_info_p = document.createElement('p');
		let followed_p = document.createElement('p');
		let following_p = document.createElement('p');
		let postnum_p = document.createElement('p');
		let postlist_ul = document.createElement('ul');
		
		let follow_button = document.createElement('span');
		follow_button.setAttribute('follow_id',data.id);
		follow_button.setAttribute('follow_name',data.username);
		
		//set id for element in this modal
		name_info_p.id = 'user_infomation_name';
		followed_p.id = 'user_infomation_followed';
		following_p.id = 'user_infomation_following';
		postnum_p.id = 'user_infomation_postnum';
		postlist_ul.id = 'user_infomation_postlist';
		
		//set the label of each row based on the text data from the content.js
		user_followed_span.innerText = text.fed;
		user_name_span.innerText = text.uname;
		user_following_span.innerText = text.feing;
		post_num_span.innerText = text.p_num;
		post_list_span.innerText = text.p_list;
		name_info_p.innerText = data.username;
		followed_p.innerText = data.followed_num;
		following_p.innerText = data.following.length;
		postnum_p.innerText = data.posts.length;
		post_list_span.style.display = 'block';
		post_list_span.style.color = 'white';
		post_list_span.style.background = ' var(--reddit-blue)';
		post_list_span.style.marginTop = '10px';
		post_list_span.style.textAlign = 'center';
		post_list_span.style.width = '20%';
		post_list_span.style.padding = '5px';
		post_list_span.setAttribute('postnum',data.posts.length);
		post_list_span.id = 'keep_posts_num';
		// add a click event listener to post_list button, animation ==>scroll down and scroll up
		
		//set style for the follow button
		user_name_div.appendChild(user_name_span);
		user_name_div.appendChild(name_info_p);
		user_name_div.appendChild(follow_button);
		user_name_div.style.position = 'relative';
		follow_button.style.position = 'absolute';
		follow_button.style.marginTop = '16px';
		follow_button.style.color = 'white';
		follow_button.style.background = 'var(--reddit-orange)';
		follow_button.style.padding = '3px';
		follow_button.style.width = 'auto';
		follow_button.id = 'follow';
		
		//outer div append child
		user_followed_div.appendChild(user_followed_span);
		user_followed_div.appendChild(followed_p);
		user_following_div.appendChild(user_following_span);
		user_following_div.appendChild(following_p);
		post_num_div.appendChild(post_num_span);
		post_num_div.appendChild(postnum_p);
		post_list_div.appendChild(post_list_span);
		post_list_div.appendChild(postlist_ul);
		
		// append child in user info modal
		user_info_div.id = 'user_infomation';
		user_info_div.appendChild(user_name_div);
		user_info_div.appendChild(user_followed_div);
		user_info_div.appendChild(user_following_div);
		user_info_div.appendChild(post_num_div);
		user_info_div.appendChild(post_list_div);
		body.appendChild(user_info_div);
		
		let followlist = JSON.parse(localStorage.getItem('follow_list'));
		follow_button.setAttribute('follow_id',data.id);
		let follow_flag = 0;
	// check if the specific user is already in the following list, if so, change the innertext
		for (let i=0;i<followlist.length;i++){
			if(followlist[i] == data.id){
				follow_flag = 1;
				break
			}
		}
		if (follow_flag == 1){
			follow_button.innerText = 'Following';
		}
		else{
			follow_button.innerText = 'Follow';
		}
		// set hover listener for this button
		follow_button.addEventListener('mouseenter',(event)=>{
			if(event.target.innerText == 'Following'){
				event.target.innerText = 'Unfollow';
			}
		});
		// set hover listener for this button
		follow_button.addEventListener('mouseleave',(event)=>{
			if(event.target.innerText == 'Unfollow'){
				event.target.innerText = 'Following';
			}
		});
		// add click listener to follow button, follow & unfollow a user
		follow_button.addEventListener('click',(event)=>{
			let token = localStorage.getItem('user_token');
			let param = {
					"method":"PUT",
					"headers": {
						"Content-Type":'application/json',
						"accept": "application/json",
						"Authorization":"Token: "+token,
					}
			}
			// follow a user
			if(event.target.innerText == 'Follow'){
				let url = API_URL+'/user/follow/?username='+event.target.getAttribute('follow_name');	
				fetch(url,param)
				.then(response=>response.json())
				.then(data=>{
					// follow success
					if(data.message == "success"){
						common_alert('Follow success!');
						setTimeout(()=>{location.reload()},1500);
					}
				})
			}
			// unfollow a user
			else{
				let url = API_URL+'/user/unfollow/?username='+event.target.getAttribute('follow_name');
				fetch(url,param)
				.then(response=>response.json())
				.then(data=>{
					// unfollow success
					if(data.message == "success"){
						common_alert('Unfollow success!');
//						let url = API_URL+'/user/?username='+event.target.getAttribute('follow_name');
//						let param = {
//							"method":"GET",
//							"headers": {
//								"Content-Type":'application/json',
//								"Authorization":" Token: "+token	
//							}
//						}
//						
//						let userinfo = fetch(url,param)
//						.then(response=>response.json())
//						.then(data=>{
//							console.log(data);
//						})
						setTimeout(()=>{location.reload()},1500);
					}
				})
			}
		});
		//post list animation in the information modal
		post_list_span.addEventListener('click',(event)=>{
			let number_of_posts = event.target.getAttribute('postnum');
			if (number_of_posts == 0){
				common_alert('Nothing\'s here!');
				return;
			}
			let boundary = 270;
			if (number_of_posts > 3){
				boundary = 270;
			}
			else{
				boundary = 90*number_of_posts;
			}
			let h =  postlist_ul.clientHeight;
			if (h==0){
				let t1 =setInterval(()=>{
					
					if (h < boundary){
						h+=3;
		//				console.log(h);
						postlist_ul.style.height = h + "px";
					}
					else{
						clearInterval(t1);
					}
					
				},10)
		 	}
			// a scroll back animation for posts list
			else{
				let t1 =setInterval(()=>{
					
					if (h !=0){
						h-=1;
		//				console.log(h);
						postlist_ul.style.height = h + "px";
					}
					else{
						clearInterval(t1);
					}
					
				},3)
			}
		});
	}
}

// a common function to initialise the comments list for a specific post, and allow logined user to post a new comment
function comment_list(param,node,li,button){
	let comments = document.createElement('div');
	let postcomments = document.createElement('div');
	let comment_input = document.createElement('input');
	let comment_button = document.createElement('span');
	postcomments.classList.add('post_comments');
	postcomments.id = 'post_comment_div'+li.dataset.idPost;
	postcomments.appendChild(comment_input);
	postcomments.appendChild(comment_button);
	comment_button.innerText = 'Post';
	comment_input.id = 'post_comment_input'+li.dataset.idPost;
	comment_button.id = 'post_comment_button'+li.dataset.idPost;
	
	comments.classList.add('comments_list');
	// create comments list! span to show username and p to show the comments info
	for (let i = 0;i<param.length;i++){
		let p = document.createElement('div');
		let b = document.createElement('span');
		let p_1 = document.createElement('p');
		b.innerText = "@"+param[i].author;
		p_1.innerText = param[i].comment+ "      at  "+timetrans(param[i].published*1);
		p.appendChild(b);
		p.appendChild(p_1);
		comments.appendChild(p);
	}
	
	
	node.appendChild(comments);
	node.appendChild(postcomments);
	document.getElementById('post_comment_button'+li.dataset.idPost).addEventListener('click',(event)=>{
		let input_content = document.getElementById('post_comment_input'+li.dataset.idPost).value;
		let token = localStorage.getItem('user_token');
		// makesure the user has already loged in before post a comment
		if (token){
			if (input_content.trim().length != 0){
				//configuration for fetch
				let id = event.target.id.replace('post_comment_button','');
				let url = API_URL+'/post/comment/?id='+id;
				let body = {
					"comment": input_content
				}
				let param = {
					"method":"PUT",
					"headers": {
						"Content-Type":'application/json',
						"Authorization":"Token: "+token,
					},
					"body":JSON.stringify(body)
				}
				
				fetch(url,param)
				.then(response=>response.json())
				.then(data=>{
					// post comments success!! update the comments list!
					if(data.message == "success"){
						let commentlist = event.target.parentNode.previousSibling;
//						console.log(commentlist);
						let first = event.target.parentNode.previousSibling.childNodes[0];
//						console.log(first);
						let comments = document.createElement('div');
						let name = document.createElement('span');
						let p = document.createElement('p');
						comments.appendChild(name);
						comments.appendChild(p);
						p.innerText = input_content+" at "+timetrans(new Date().getTime());
						name.innerText = localStorage.getItem('username');
						// set position for comments list
						if (first){
							commentlist.insertBefore(comments,first);
						}
						else{
							commentlist.appendChild(comments);
						}
						
						let comment_num = document.getElementById('comments'+id);
						let count_num = comment_num.innerText.replace('Comments(','').replace(')','');
						count_num++;
						comment_num.innerText = "Comments("+count_num+")";
						document.getElementById('post_comment_input'+li.dataset.idPost).value = "";
						//check the number of comments, one comments will use like 50px in height, if greater than 3
						// comments ,only display the first 3 comments, scroll to see the other comments
						let com_height = (count_num>=3) ? 150:count_num*50;
//						console.log(com_height);
						commentlist.style.height = com_height+'px';
						
						
					}
				})
			}
			else{
				// if the input is empty, alert user
				common_alert('Comment Cannot be empty');
				return;
			}
		}
		else{
			// if user has not loged in when post a comment
			common_alert('You need to Login first');
			return;
		}
	})
	//set a click event listener to comments(num) element, click to see all of the comment list!
	// click the element again to unfold the comment list
	button.addEventListener('click',(event)=>{
		let getid = event.target.parentNode.parentNode.dataset.idPost;
		let number_of_comments = event.target.innerText.replace('Comments(','').replace(')','');
		let boundary = 150;
		// set height accodring to the number of commets
		if (number_of_comments > 3){
			boundary = 150;
		}
		else{
			boundary = 50*number_of_comments;
		}
		let h =  comments.clientHeight;
		// a scroll down animation for comments list, when scroll down complete, the input area also will showup
		if (h==0){
			document.getElementById('post_comment_div'+getid).style.display = 'block';
			let t1 =setInterval(()=>{
				
				if (h < boundary){
					h+=3;
	//				console.log(h);
					comments.style.height = h + "px";
				}
				else{
					clearInterval(t1);
				}
				
			},10)
	 	}
		// a scroll back animation for comments list, when scroll back, the input area will also disappear
		else{
			document.getElementById('post_comment_div'+getid).style.display = 'none';
			let t1 =setInterval(()=>{
				
				if (h !=0){
					h-=1;
	//				console.log(h);
					comments.style.height = h + "px";
				}
				else{
					clearInterval(t1);
				}
				
			},3)
		}
	});
	
}

// initiate the upvite list of a specific post
function upvote_list(param,node,parent,id,clicker){
	let token = localStorage.getItem('user_token');
	let ul = document.createElement('div');
	ul.classList.add('upvote_list');
	parent.appendChild(ul);
	ul.id = "uplist"+id;
	let login_username = localStorage.getItem('username');
	let flag = 1;
//	console.log(param.upvotes);
// user have to login before they see the upvote info
	if (token){
		let data = param.upvotes;
		// fetch to initiate upvotes list
		for (let i=0;i<data.length;i++){
			let url = API_URL+'/user/?id='+data[i];
			let param = {
				"method":"GET",
				"headers": {
					"Content-Type":'application/json',
					"Authorization":"Token: "+token,
				}
			}
			fetch(url,param)
			.then(reponse=>reponse.json())
			.then(data=>{
				let newli = document.createElement('li');
				newli.classList.add('upvote_item');
				if (login_username == data.username){
					clicker.style.background = "var(--reddit-blue)";
					clicker.style.color = "white";
				}
				newli.innerText = "@"+data.username;
				ul.appendChild(newli);
			})
			.catch(err=>{console.log(err)});
			
		}
	}
//	console.log(node);
// add a mouseenter event listener to see the upvote list
	ul.addEventListener('mouseenter',()=>{
		let t1 =setInterval(()=>{
			let opa =  ul.style.opacity * 100;
			if (opa != 0){
				opa+=1;
				ul.style.opacity = opa/100;
			}
			else{
				clearInterval(t1);
			}
			
		},2)
	});
	// when mouse leave, the list should disappear
	ul.addEventListener('mouseleave',()=>{
		let t2 =setInterval(()=>{
			let opa =  ul.style.opacity * 100;
			if (opa != 0){
				opa-=1;
				ul.style.opacity = opa/100;
			}
			else{
				clearInterval(t2);
			}
			
		},2)
	});
	// makesure the list will not disappear when the mouse is over the list
	node.addEventListener('mouseenter',()=>{
		let t3 =setInterval(()=>{
			let opa =  ul.style.opacity * 100;
			if (opa <= 100){
				opa+=1;
				ul.style.opacity = opa/100;
			}
			else{
				clearInterval(t3);
			}
			
		},2)
	});
	// when mosut leave the list, disappear!
	node.addEventListener('mouseleave',()=>{
		let t4 =setInterval(()=>{
			let opa =  ul.style.opacity * 100;
			if (opa != 0){
				opa-=1;
				ul.style.opacity = opa/100;
			}
			else{
				clearInterval(t4);
			}
			
		},2)
	});
	// if user click the upvote button, upvote that list and plus one
	node.addEventListener('click',(event)=>{
		let postid = event.target.parentNode.dataset.idPost;
		let usertoken = localStorage.getItem('user_token');
		if (usertoken == ""){
			// make sure that user is logged in
			common_alert('You need to login first');
		}
		else{
//			console.log(event.target.style.background);
			if (event.target.style.background == "var(--reddit-blue)"){
				let up_url = API_URL+'/post/vote?id='+postid;
				let params = {
					"method":"DELETE",
					"headers": {
						"Content-Type":'application/json',
						"Authorization":"Token: "+usertoken,
					}
				}
				fetch(up_url,params)
				.then(response => response.json())
				.then(data=>{
					if(data.message =='success'){
						common_alert('Cancel success');
						event.target.style.background = "var(--reddit-light-grey)";
						event.target.style.color = 'var(--reddit-blue)';
						let origin_num = event.target.innerText;
						let username = localStorage.getItem('username');
						event.target.innerText = origin_num - 1;
						let uplistid = "uplist"+event.target.parentNode.dataset.idPost;
						let uplist = document.getElementById(uplistid);
						for (let i = 0; i<uplist.childNodes.length; i++){
							if(uplist.childNodes[i].innerText == "@"+username){
								uplist.removeChild(uplist.childNodes[i]);
							}
						}
					}
				})
			}
			else{
			// configuration for fetch
				let up_url = API_URL+'/post/vote?id='+postid;
				let params = {
					"method":"PUT",
					"headers": {
						"Content-Type":'application/json',
						"Authorization":"Token: "+usertoken,
					}
				}
	//			console.log(postid);
	//			console.log(usertoken);
	//			alert("refresh");
				fetch(up_url,params)
				.then(response => response.json())
				.then(data => {
					// success! update the upvote list and the number will plus one
					let username = localStorage.getItem('username');
					let uplistid = "uplist"+event.target.parentNode.dataset.idPost;
					let uplist = document.getElementById(uplistid);
					if (uplist.childNodes.length == 0){
						common_alert('Upvote successful!');
						let newli = document.createElement('li');
						newli.innerText = "@"+username;
						newli.classList.add('upvote_item');
						uplist.appendChild(newli);
						event.target.style.background = 'var(--reddit-blue)';
						event.target.style.color = "white";
					}
					else{
						// the user already upvoted the list, number should not plus one!
						for (let i=0;i<uplist.childNodes.length;i++){
							if (uplist.childNodes[i].innerText == "@"+username){
								common_alert("You've already upvoted this post");
								return;
							}
						}
						event.target.style.background = 'var(--reddit-blue)';
						event.target.style.color = "white";
						let first = uplist.childNodes[0];
						let newli = document.createElement('li');
						newli.innerText = "@"+username;
						newli.classList.add('upvote_item');
						uplist.insertBefore(newli,first);
						common_alert('Upvote successful!');
						//alert user if the number of upvotes is 0
					}
					let up_num =parseInt(event.target.innerText)+1;
					event.target.innerText =up_num;
				})
			}
		}
	});
	return ul;
	
}

// function to implement search function
function search_init(data){
	let search_input = document.getElementById('search');
	let parent = search_input.parentNode;
	parent.style.position = 'relative';
	let search_button = document.createElement('span');
//	search_button.innerText = 'Search';
	search_button.id = 'search_button';
	let width = search_input.clientWidth;
	console.log(width);
	parent.appendChild(search_button);
	search_button.style.left = (width+12)+'px';
	search_input.style.marginRight = '30px'; 
	search_button.addEventListener('click',()=>{
		localStorage.setItem('login_post_p',0);
		let token = localStorage.getItem('user_token');
		if (token == ""){
			// user need to login before search
			common_alert('Please login first!');
			return;
		}
		if(search_input.value == ""){
			common_alert("Please enter something");
		}
		else{
			clearAll();
			let search_v = search_input.value;
			localStorage.setItem('Searching',search_v);
			let url = API_URL+'/user/feed/';
			let pro_param = {
				"method":"GET",
				"headers": {
					"Content-Type":'application/json',
					"Authorization":" Token: "+token	
				}
			}
			let fetch_list = [];
			let create_list = []
			promise_search(url,pro_param,10,0,search_v,fetch_list,create_list);
		}
	})
	
}

function promise_search(url,param,n,p,condition,fetch_list,create_list){
	let newurl = url+'?p='+p+'&n='+n;
	fetch(newurl,param)
	.then(response => response.json())
	.then(data=>{
		let repeate_flag = 0;
//		console.log("n == "+n);
//		console.log("p == "+p);
//		console.log("create_list == "+create_list);
//		console.log("fetch_list == "+fetch_list);
		if (!data.posts){
			return;
		}
		for (let i = 0;i< data.posts.length; i ++){
//					console.log(data.posts[i]);
					if ( data.posts[i].meta.author == condition || 
						 data.posts[i].meta.subseddit == condition ||
						 data.posts[i].title == condition ){
						if (create_list.includes(data.posts[i].id)){
//							console.log("hew11");
							repeate_flag = 1;
						}else{
//							console.log(data.posts[i]);
							create_post(data.posts[i],0);
							create_list.push(data.posts[i].id);
						}
					}
					else{
						if(fetch_list.includes(data.posts[i].id)){
//							console.log("fetch_list222 == "+fetch_list);
//							console.log("hew22");
//							console.log("id =="+data.posts[i].id);
							repeate_flag = 1;
						}
					}
					fetch_list.push(data.posts[i].id);
		}
		if (repeate_flag == 1){
			console.log("hew");
			return 0;
			// when fetch repeat data,return 0 to stop!
		}
		else{
			return data.posts.length;
		}
	})
	.then((data)=>{
		if (data == n){
			let new_p = p+10;
//			let in_url = url+'?p='+new_p+'&n='+n;
			promise_search(url,param,n,new_p,condition,fetch_list,create_list);
		}
		else if (data == 0){
			if (create_list.length == 0){
				common_alert('Nothing\'s here');
				setTimeout(()=>{location.reload()},1500);
			}
		}
	})
}

function setTimeCheck(){
	let url = API_URL+'/user/';
	let token = localStorage.getItem('user_token');
	if (token){
		// user must login
		// if notification list is set!
		if (localStorage.getItem('push_noti')){
			let noti_list = JSON.parse(localStorage.getItem('push_noti'));
			if(noti_list){
				let noti_ul = document.getElementById('notification_ul');
				for (let i = 0;i<noti_list.length;i++){
					let flag = 1;
					let noti_li = document.createElement('li');
					let Text = noti_list[i].username+"Just posted a new content!";
					for (j = 0;j<noti_ul.childNodes.length;j++){
						if (noti_ul.childNodes[j].innerText == Text){
							flag = 0;
						}
					}
					if (flag == 1){
						li.innerText = Text;
						noti_ul.appendChild(noti_li);
						noti_li.classList.add('notification_li');
						document.getElementById('notification').style.display = 'inline-block';
						document.getElementById('notification').innerText = noti_ul.childNodes.length;
					}
				}
				
			}
		}
		let param = {
			"method":"GET",
			"headers": {
				"Content-Type":'application/json',
				"Authorization":" Token: "+token	
			}
		}
		let userinfo = fetch(url,param)
					   .then(response=>response.json())
					   .then(data=>{
//					   		console.log(data);
					   		let param = {
								"method":"GET",
								"headers": {
									"Content-Type":'application/json',
									"Authorization":" Token: "+token	
								}
							}
					   		let fetch_user_post = [];
					   		// get list of user following
//					   		localStorage.setItem('user_post',JSON.stringify(user_post));
					   		for (let i =0;i<data.following[i]; i++){
					   			let url = API_URL+'/user/?id='+data.following[i];
					   			fetch_user_post.push(fetch_data(url,param));
					   		}
					   		// promise all get all of posts list of user
					   		Promise.all(fetch_user_post)
					   		.then(data=>{
					   			let user_post = [];
					   			for(let i=0;i<data.length;i++){
					   				let body = {}
					   				body.username = data[i].username;
					   				body.id = data[i].id;
					   				body.posts = data[i].posts;
					   				user_post.push(body);
					   			}
					   			return user_post;
					   			// generate a new post list
					   		})
					   		.then(data=>{
					   			// compare with userpost before
					   			if(localStorage.getItem('user_post')){
					   				let before_data = JSON.parse(localStorage.getItem('user_post'));
					   				if (data.length == before_data.length){
					   					for(let i = 0; i<data.length;i++){
					   						for (let j=0;j<before_data.length;j++){
					   							if (data[i].id == before_data[j].id){
					   								if (data[i].posts.sort() != before_data[j].posts.sort());{
					   									if(data[i].posts.length > before_data[j].posts.length){
					   										let temp = data[i].posts.sort;
					   										let temp2 = before_data[j].posts.sort
					   										for(let k=0;k<temp2.length;k++){
					   											if (temp.includes(temp2[k])){
					   												let index = array.indexOf(temp2[k]);
					   												temp = array.splice(index, 1);
					   											}
					   										}
					   										//notification the user about the new content
					   										localStorage.setItem('push_noti',JSON.stringify(temp));
					   									}
					   								}
					   							}
					   						}
					   					}
					   				}
					   				localStorage.setItem('user_post',JSON.stringify(data));
					   			}else{
					   				localStorage.setItem('user_post',JSON.stringify(data));
					   			}
					   		})
//					   			fetch(url,param)
//					   			.then(response=>response.json())
//					   			.then(data=>{
//					   				let body = {};
//					   				body.username = data.username;
//					   				body.id = data.id;
//					   				body.posts = data.posts;
//					   				let user_post = JSON.parse(localStorage.getItem('user_post'));
//					   				console.log(user_post);
//					   				user_post.push(body);
//					   				localStorage.setItem('user_post',JSON.stringify(user_post));
//					   			})
					   		
					   		
					   })
	}
	
}

// event function that will triger when mask show up, don't allow user to scroll when mask show up
function scollban(){
	scrollTo(0,0);
}

// a common function to transfer a time stamp to time string
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
//bind click and scroll event
function event_bind(){
	let login = document.querySelector('button.button.button-primary');
	// login button listener
	login.addEventListener('click',event =>{
		document.getElementById('mask').style.display = 'block';
		document.getElementById('login_form').style.display = 'block';
		window.addEventListener('scroll',scollban)
	});
	// regist button listener
	let regist = document.querySelector('button.button.button-secondary');
	regist.addEventListener('click',event =>{
		document.getElementById('mask').style.display = 'block';
		document.getElementById('regist_form').style.display = 'block';
		window.addEventListener('scroll',scollban)
	});
	let post_but = document.getElementsByClassName('button-secondary')[1];
	let mask = document.getElementById('mask');
	post_but.addEventListener('click',()=>{
		window.addEventListener('scroll',scollban);
	})
	// infinite scroll to load posts
	window.addEventListener('scroll',event=>{
		let scrollTop = 0; 
		let clientHeight = 0;  
		if (document.documentElement && document.documentElement.scrollTop) {   
			scrollTop = document.documentElement.scrollTop;   
		}   
		else if (document.body) {   
			scrollTop = document.body.scrollTop;   
		}  
		if (document.body.clientHeight && document.documentElement.clientHeight) {   
			clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);   
		}   
		else {   
			clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);   
		}   
		if (scrollTop + clientHeight== Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) {  
			common_alert('Loading...');
			let token = localStorage.getItem('user_token');
			if (token){
				let login_post_p = parseInt(localStorage.getItem('login_post_p'))+10;
				let login_post_n =  localStorage.getItem('login_post_n')
				let url = API_URL+'/user/feed?p='+login_post_p+'&n='+login_post_n;
				
				let pro_param = {
					"method":"GET",
					"headers": {
						"Content-Type":'application/json',
						"Authorization":" Token: "+token	
					}
				}
				let login_post = fetch(url,pro_param)
				.then(response => response.json())
				.then(data =>{
					document.getElementById('alert').style.display = 'none';
		//			console.log(data);
					if(data.posts.length == 0){
						common_alert('No more posts here!');
					}
					else{
						localStorage.setItem('login_post_p',login_post_p);
					}
					let searching = localStorage.getItem("Searching");
					console.log(searching);
					if (searching){
						let ul_list = document.getElementById('feed').childNodes;
						let exists_list = [];
						ul_list.forEach((val,index)=>{
							if(val.tagName == 'LI'){
								if(val.dataset.idPost){
									exists_list.push(val.dataset.idPost);
								}
							}
	//						
						})
//						let count = 0;
						for (let i = 0;i< data.posts.length; i ++){
							if(exists_list.includes(data.posts[i].id)){
								create_post(data.posts[i],searching);
							}
						}
					}
					else{
						for (let i = 0;i< data.posts.length; i ++){
							create_post(data.posts[i],searching);
						
						}
					}
//					console.log(exists_list);
//					for (let i = 0;i< data.posts.length; i ++){
//							if(exists_list.includes(data.posts[i].id)){
//								create_post(data.posts[i],searching);
//							}
//						else{
//							create_post(data.posts[i],searching);
//						}
//						
//					}
				})
			}
		}  
	})
	
}

function profile_bind(){
	let edit = document.getElementById('profile_edit');
	let logout = document.getElementById('profile_logout');
	let form = document.getElementById('profile_form');
	logout.addEventListener('click',()=>{
		document.getElementById('mask').click();
		document.getElementsByClassName('profile')[0].style.display = 'none';
		document.getElementsByClassName('button-primary')[0].style.display = 'inline';
		document.getElementsByClassName('button-secondary')[0].style.display = 'inline';
		localStorage.setItem('user_token','');
		localStorage.setItem('email','');
		localStorage.setItem('name','');
		localStorage.setItem('username','');
		location.reload();
	})
//	edit.addEventListener('click',()=>{
//		
//	})
}

function show_profile(){
	let profile = document.getElementsByClassName('profile')[0];
	profile.addEventListener('click',()=>{
		document.getElementById('mask').style.display = 'block';
		window.addEventListener('scroll',scollban);
		document.getElementById('profile_form').style.display = 'block';
	})
}
// a common function to generate a promise list ( used in promise.all)
function fetch_data(url,param){
	return fetch(url,param).then(response=>response.json());
}
// create dom element with js
function Createmask(){
    let mask = document.createElement('div');
    let alert = document.createElement('div');
    alert.id = 'alert';
    mask.id = 'mask';
    body.appendChild(mask);
    body.appendChild(alert);
    mask.addEventListener('click',event =>{
    	//  when close mask, elements appear with mask should disappear too
    		mask.style.display = 'none';
    		document.getElementById('login_form').style.display = 'none';
    		document.getElementById('regist_form').style.display = 'none';
    		document.getElementById('login_info').style.display = 'none';
    		document.getElementById('regist_info').style.display = 'none';
    		document.getElementById('upload_form').style.display = 'none';
    		// profile disappear
    		if (document.getElementById('profile_form')){
    			document.getElementById('profile_form').style.display = 'none';
    		}
    		// edit form in profile should disappear
    		if(document.getElementById('edit_profile')){
    			document.getElementById('edit_profile').style.height = 0+'px';
    			document.getElementById('edit_name_input').value = "";
    			document.getElementById('edit_email_input').value = "";
    			document.getElementById('edit_pass_input').value = "";
    		}
    		// user information should disappear
    		if (document.getElementById('user_infomation')){
    			document.getElementById('user_infomation').style.display = 'none';
    			document.getElementById('user_infomation_postlist').style.height = 0+'px';
    		}
    		// posts list in user information modal should disappear
    		if (document.getElementById( 'user_profile_posts_list')){
    			document.getElementById('user_profile_posts_list').style.height = 0+'px';
    		}
    		// when update a post and quit, initialise the post modal
    		if (document.getElementById('upload_form')){
    			document.getElementById('upload_post').innerText = "Post";
    			let up_button = document.getElementById('upload_post');
    			let type = up_button.getAttribute('type');
//  			console.log(type);
    			if (type == 'update'){
    				//reinitiate the post modal!
    				up_button.setAttribute('type','');
    				up_button.setAttribute('update_id','');
    				up_button.setAttribute('update_sub','');
    				up_button.setAttribute('update_title','');
    				up_button.setAttribute('update_con','');
    				up_button.setAttribute('update_img','');
    				document.getElementById('post_title').value = '';
    				document.getElementById('post_content').value = '';
    				document.getElementById('post_sub').value = '';
    				document.getElementById('select_file').value = '';
    				if (document.getElementsByClassName('img_div')){
    					let img = document.getElementsByClassName('img_div')[0];
    					document.getElementById('upload_form').removeChild(img);
    				}
    			}
    		}
    		//cancel the scroll ban
    		window.removeEventListener('scroll',scollban);
    });
}
export default init_form