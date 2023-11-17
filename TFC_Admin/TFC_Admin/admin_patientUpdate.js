import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, getDoc, collection, getDocs, updateDoc} from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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
const db = getFirestore(app)

//Getting the patient id in order to display the patient details and edit it
const  urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');

//Retrieving the patient details based on the patientId
const patientDocRef = doc(db, "patients", patientId);

//Fetching the patient data
getDoc(patientDocRef)
.then((doc) => {
    if(doc.exists()) {
        const patientData = doc.data();

        //Populate the input fields on the edit page with patientData
        document.getElementById('edit_email').value = patientData.email;
        document.getElementById('edit_name').value = patientData.name;
        document.getElementById('edit_phoneNumber').value = patientData.phoneNumber;
        document.getElementById('edit_username').value = patientData.username;

    } else{
        console.error("Patient  document not found");
    }
})
.catch((error) => {
    console.error("Error fetching patient data: ", error);
})

//calling the form id form editing patient data
const updatePatientForm = document.getElementById('updatePatient-form');

updatePatientForm.addEventListener('submit', (event) => {

  event.preventDefault();

  console.log('Form submitted'); // Add this line for debugging

    const updatedPatientEmail = document.getElementById('edit_email').value;
    const updatedPatientName = document.getElementById('edit_name').value;
    const updatedPatientPhoneNumber = document.getElementById('edit_phoneNumber').value;
    const updatedPatientUsername = document.getElementById('edit_username').value;

    //Updating the patient data in Firestore
    updateDoc(patientDocRef, {
        email       : updatedPatientEmail,
        name        : updatedPatientName, 
        phoneNumber : updatedPatientPhoneNumber,
        username    : updatedPatientUsername,
    })
    .then(() => {
        alert("Patient data upated successfully.");
        window.location.href = "admin_patients.html";
    })
    .catch((error) => {
        console.error("Error updating  patient data: ", error);
    });

});

// Function to handle patient logout
function handleLogout() {
    signOut(auth)
      .then(() => {
        // User has been successfully logged out
        window.location.href = "adminlogin.html"; // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

// Checking if a user is signed in
auth.onAuthStateChanged(async(user) => {
  console.log("User:", user);
    if (user) {
      // User is signed in
      var userUsernameElement = document.getElementById("user-username");
  
      // Fetch the user's data from your database
      var uid = user.uid; // Get the user's unique ID
      var userDocRef = doc(db, "admins", uid);
     
  
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.username) {
            var username = userData.username;
            userUsernameElement.textContent = "Welcome, " + username;
          } else {
            console.error("Admin data does not contain the 'username' field.");
          }
        } else {
          console.error("Admin document does not exist in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    
    
    } else {
      // User is not logged in
      console.error("Admin is not logged in.");
  }
});

const logoutLink = document.getElementById("logout");

  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }


