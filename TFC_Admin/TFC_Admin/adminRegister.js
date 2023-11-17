import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, collection, doc,  setDoc} from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

//Connecting tfc teladoc to firebase by getting the firebase connection details
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

//Initialize firebase
const app = initializeApp(firebaseConfig);


//Initialize variables
const auth = getAuth()
const db = getFirestore(app)

//Set up our register function
window.adminSignUp = function (e) {
    e.preventDefault();
    
      var name = document.getElementById('name').value;
      var username = document.getElementById('username').value;
      var email 	 = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      var phoneNumber = "";
      
       //validtae input fields
       if(validate_email(email) == false || validate_password(password) == false){
           alert('Email or Password is not in correct format!!!')
           return
       }
       if(validate_field(name) == false || validate_field(username) == false ){
           alert('Incorrect format!!!')
       }
       
       createUserWithEmailAndPassword(auth,email,password)
       .then(function(){
           
        var user = auth.currentUser
        var uid = user.uid
           const createdAt = new Date().toISOString();
           
           //Add this user to Firebase Database
		 const adminsCollection = collection(db, "admins");
           
           //Create User data
           var admin_data = {
               name           : name,
               username       : username,
               email          : email,
               phoneNumber    : phoneNumber,
               createdAt      : createdAt,
               uid			  : uid
           }

           const userDocRef = doc(adminsCollection, uid);

           setDoc(userDocRef, admin_data)
		 .then(() => {
		   alert("User Created!!");
		   window.location.href = "adminlogin.html";
		 })
		 .catch((error) => {
		   console.error("Error adding document: ", error);
		   alert("Failed to create user.");
		 });
	 })
	 .catch((error) => {
	   const errorCode = error.code;
	   const errorMessage = error.message;
 
	   alert(errorMessage);
	 });
           
           
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
  
      
