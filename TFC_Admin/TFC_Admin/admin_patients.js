import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, getDoc, collection, getDocs, deleteDoc } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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



// Function to fetch and display patient data
async function displayPatients() {
  const patientsCollection = collection(db, "patients");

  try {
      const querySnapshot = await getDocs(patientsCollection);
      const patientList = document.getElementById("patient-list");

      querySnapshot.forEach((doc) => {
          const patientData = doc.data();

          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${patientData.name}</td>
              <td>${patientData.username}</td>
              <td>${patientData.email}</td>
              <td>${patientData.phoneNumber}</td>
              <td>
                  <a href="admin_patientUpdate.html?id=${doc.id}" class="btn"><i class="fas fa-edit"></i> Edit</a>
                  <a href="admin_patients.html?id=${doc.id}" class="btn remove-btn" data-patient-id="${doc.id}"><i class="fas fa-trash"></i> Remove</a>
                  <a href="admin_patientView.html?id=${doc.id}" class="btn"><i class="fas fa-eye"></i> View</a>
              </td>
          `;

          patientList.appendChild(row);
      });
  } catch (error) {
      console.error("Error fetching patients: ", error);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.has('id') ? urlParams.get('id') : null;

if (patientId !== null) {
  
  const patientDocRef = doc(db, "patients", patientId);

  deleteDoc(patientDocRef)
  .then(() => {
    console.log('Patient removed from Firestore.');
    window.location.href = 'admin_patients.html';
  })
  .catch((error) => {
    console.error('Error removing patient from Firestore:', error);
  });
  // Rest of your code related to patientDocRef
} else {
  // Handle the case where the 'id' parameter is missing or invalid.
  console.error("No 'id' parameter found in the URL.");
}



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
            displayPatients();
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
      console.error("User is not logged in.");
  }
});

const logoutLink = document.getElementById("logout");

  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }


