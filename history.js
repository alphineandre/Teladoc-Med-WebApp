import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, addDoc, setDoc, collection, query, where, getDocs, getDoc } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

//Declare the variables to be used to fetch the patient's name and phone number
var name;

//Fucntion for storing current logged patient's medical history into direbase
document.getElementById("history-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const age = document.getElementById("age").value;
  const allergies = document.getElementById("allergies").value;
  const familyDisorders = document.getElementById("family-disorder").value;
  const lastVisit = document.getElementById("last-visit").value;
  
  

  // Check if all required fields are filled
  if (!name || !age || !lastVisit) {
    alert("Please fill in all required fields.");
    return;
  }

  // Set the medical history document in Firestore
  const historyCollection = doc(db, "medical_history", auth.currentUser.uid);

  setDoc(historyCollection, {
    age: age,
    allergies: allergies,
    familyDisorders: familyDisorders,
    lastVisit: lastVisit,
    name: name,
  })
    .then(() => {
      alert("Medical history stored successfully.");
      // Optionally, clear the form fields after submission
      document.getElementById("history-form").reset();
    })
    .catch((error) => {
      console.error("Error storing medical history:", error);
    });
});


// Function to handle patient logout
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
            name = userData.name;
            userUsernameElement.textContent = "Welcome, " + username;
            updateTotalCounts();

            document.getElementById("name").value = name;

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

//Checking if user clicks on a link and isn't signed in, they must then be redirected to the login page
auth.onAuthStateChanged(function (user) {
  if (!user) {
      // User is not signed in
      const medicalHistoryLink = document.getElementById("medical-history-link");
      const medicalRecordLink = document.getElementById("medical-record-link");
      const appointmentLink = document.getElementById("appointment-link");
      const histtoryReportLink = document.getElementById("history-report-link");


      if (histtoryReportLink) {
        histtoryReportLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "login.html"; // Redirect to the login page
        });
    }

      if (appointmentLink) {
        appointmentLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "login.html"; // Redirect to the login page
        });
    }

      if (medicalHistoryLink) {
          medicalHistoryLink.addEventListener("click", function (event) {
              event.preventDefault();
              window.location.href = "login.html"; // Redirect to the login page
          });
      }

      if (medicalRecordLink) {
          medicalRecordLink.addEventListener("click", function (event) {
              event.preventDefault();
              window.location.href = "login.html"; // Redirect to the login page
          });
      }
  }
});

const logoutLink = document.getElementById("logout");

  if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
  }

  async function updateTotalCounts() {
    const doctorsRef = collection(db, "healthcare_providers");
    const patientsRef = collection(db, "patients");

    try {
        const doctorsSnapshot = await getDocs(doctorsRef);
        const patientsSnapshot = await getDocs(patientsRef);

        const totalDoctors = doctorsSnapshot.size; // Number of doctors
        const totalPatients = patientsSnapshot.size; // Number of patients

        const doctorsCountElement = document.getElementById("doctors-count");
        const patientsCountElement = document.getElementById("patients-count");

        doctorsCountElement.textContent = totalDoctors;
        patientsCountElement.textContent = totalPatients;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}
