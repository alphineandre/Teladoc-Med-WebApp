import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, setDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyBUKsZrxaX1o6QymSQTK9yySNJNtkqCTbA",
	authDomain: "tfc-teladoc.firebaseapp.com",
	databaseURL: "https://tfc-teladoc-default-rtdb.firebaseio.com",
	projectId: "tfc-teladoc",
	storageBucket: "tfc-teladoc.appspot.com",
	messagingSenderId: "375152531777",
	appId: "1:375152531777:web:ceb7d95b5998c2683929c0",
	measurementId: "G-Y8VLPPJ4JY"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth()
const db = getFirestore(app)


window.adminLogin = function (e) {
e.preventDefault();

	var email 	 = document.getElementById('email').value
	var password = document.getElementById('password').value
	
	 //validtae input fields
	 if(validate_email(email) == false || validate_password(password) == false){
		 alert('Email or Password is not in correct format!!!')
		 return
	 }
	 
	 signInWithEmailAndPassword(auth, email, password)
	 .then(async() => {
		  var user = auth.currentUser
		 
		 
		 alert('Admin Logged In!!')
		 window.location.href = "admindash.html";
	 })
	 .catch(function(error){
		 var error_code = error.code
		 var error_message = error.message 
		 
		 alert(error_message)
	 })
};

function validate_email(email){
	var expression = /^[^@]+@\w+(\.\w+)+\w$/
	if(expression.test(email) == true){
		return true
	}else{
		return false
	}
}

function validate_password(password){
    // Firebase only accepts lengths greater than 6
    if (password.length < 6) {
        return false;
    } else {
        return true;
    }
}

function validate_field(field){
	 if(field == null){
		 return false
	 }
	 if(field.length <= 0){
		 return false
	 }else{
		 return true
	 }
}
	