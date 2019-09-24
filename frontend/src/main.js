/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.

// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
import init_form from './initiate_form.js';
const body = document.getElementsByTagName('body')[0];
function initApp(apiUrl) {
  // your app initialisation goes here
	init_form();
}



export default initApp;
