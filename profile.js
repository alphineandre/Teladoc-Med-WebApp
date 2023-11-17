import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc} from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

//Initialize variables
const auth = getAuth()
const db = getFirestore(app)


const updateProfileForm = document.getElementById("update-profile-form");


// Function to populate the form with the current user's details
async function populateProfileForm() {
  const user = auth.currentUser;
  if (user) {
      const uid = user.uid;
      const userRef = doc(db, "patients", uid); // Correct variable name

    try {
      const docSnapshot = await getDoc(userRef); // Correct variable name
      console.log("Document snapshot data:", docSnapshot.data()); // Debug statement
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (userData) {
          // Debug: log the user data to the console
          console.log("User Data:", userData);

          // Fill the form fields with the user's data
          document.getElementById("update_email").value = userData.email;
          document.getElementById("update_name").value = userData.name;
          document.getElementById("update_phonNumber").value = userData.phoneNumber;
          document.getElementById("update_username").value = userData.username;
        } else {
          // Debug: log an error message if userData is null
          console.error("User data not found.");
        }
      } else {
        console.error("User document does not exist in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
}



updateProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get user input from the form fields
    const email = document.getElementById("update_email").value 
    const name = document.getElementById("update_name").value
    const phoneNumber = document.getElementById("update_phonNumber").value 
    const username = document.getElementById("update_username").value 

  

    // Update user profile data in the Realtime Database
    const uid = auth.currentUser.uid; // Get the current user's UID
        const userRef = doc(db, "patients" , uid);

        setDoc(userRef, {
          email,
          name,
          phoneNumber,
          username,
        }).then(() => {
          // Profile data updated successfully
          alert("Profile updated successfully.");
          // Redirect to the user's profile page or any other page
          window.location.href = "index.html";
        }).catch((error) => {
          // Handle errors
          console.error("Error updating profile:", error);
          alert("An error occurred while updating your profile.");
        });
     
  });


function handleLogout() {
    signOut(auth)
      .then(() => {
        // User has been successfully logged out
        window.location.href = "login.html"; // Redirect to the login page
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
      var userDocRef = doc(db, "patients", uid);
     
  
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.username) {
            var username = userData.username;
            userUsernameElement.textContent = "Welcome, " + username;
            populateProfileForm();
          } else {
            console.error("User data does not contain the 'username' field.");
          }
        } else {
          console.error("User document does not exist in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    
    
    } else {
      // User is not logged in
      userUsernameElement.textContent = "Welcome, guest";
      console.error("User is not logged in.");
  }
});


const logoutLink = document.getElementById("logout");

  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }


 