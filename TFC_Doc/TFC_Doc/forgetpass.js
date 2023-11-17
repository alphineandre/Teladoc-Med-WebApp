import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize variables
const auth = getAuth()

//Calling the id in the forgot password html page for allowing users to get a password reset email
const passwordResetForm = document.getElementById("password-reset-form");

passwordResetForm.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;

    //validtae input fields
	 if(validate_email(email) == false ){
        alert('Email  is not in correct format!!!')
        return
    }
  
    sendPasswordResetEmail(auth, email)
      .then(function () {
        // Password reset email sent successfully
        alert("Password reset email sent. Check your inbox!");
        window.location.href = "doclogin.html";
      })
      .catch(function (error) {
        // Handle errors
        console.error(error);
        alert("An error occurred. Please check the email address and try again.");
      });
  });

  function validate_email(email){
	var expression = /^[^@]+@\w+(\.\w+)+\w$/
	if(expression.test(email) == true){
		return true
	}else{
		return false
	}
}