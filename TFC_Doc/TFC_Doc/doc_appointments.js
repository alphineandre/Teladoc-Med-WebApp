import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, getDoc, collection, getDocs } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";


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
async function displayAppointments() {
  const patientsCollection = collection(db, "appointments");

  try {
      const querySnapshot = await getDocs(patientsCollection);
      const appointmentList = document.getElementById("Appointment-list");

      querySnapshot.forEach((doc) => {
          const apointmentData = doc.data();

          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${apointmentData.name}</td>
              <td>${apointmentData.cell}</td>
              <td>${apointmentData.date}</td>
              <td>${apointmentData.doctorName}</td>
              <td>${apointmentData.doctorSpeciality}</td>
              <td>${apointmentData.symptoms}</td>
              <td>${apointmentData.appointmentType}</td>
              <td>${apointmentData.status}</td>
              
              <td>
              <a href="doc_appointmentUpdate.html?id=${doc.id}" class="btn"><i class="fas fa-edit"></i> Edit</a>
              <a href="doc_appointmentView.html?id=${doc.id}" class="btn"><i class="fas fa-eye"></i> View</a>
          </td>
      `;

          appointmentList.appendChild(row);
      });
  } catch (error) {
      console.error("Error fetching appointments: ", error);
  }
}
  
// Function to handle patient logout
function handleLogout() {
    signOut(auth)
      .then(() => {
        // User has been successfully logged out
        window.location.href = "doclogin.html"; // Redirect to the login page
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
      var userDocRef = doc(db, "healthcare_providers", uid);
     
  
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.username) {
            var username = userData.username;
            userUsernameElement.textContent = "Welcome, " + username;
            displayAppointments();
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


