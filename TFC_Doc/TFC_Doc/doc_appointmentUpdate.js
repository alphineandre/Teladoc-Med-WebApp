import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, getDoc, collection, getDocs, updateDoc } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";


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

// Function to populate the doctor dropdown
// Function to populate the doctor dropdown
async function populateDoctorsDropdown() {
    const doctorDropdown = document.getElementById("doctor");
    const doctorsRef = collection(db, "healthcare_providers");
  
    try {
        const querySnapshot = await getDocs(doctorsRef);
        querySnapshot.forEach((doc) => {
            const option = document.createElement("option");
            option.value = doc.id;
            // Combine the doctor's name and speciality and set it as the option text
            option.textContent = doc.data().fullname + " (" + doc.data().speciality + ")";
            doctorDropdown.appendChild(option);
  
            // Store the doctor's name and speciality as data attributes in the option element
            option.dataset.doctorName = doc.data().fullname;
            option.dataset.doctorSpeciality = doc.data().speciality;
        });
    } catch (error) {
        console.error("Error fetching doctors: ", error);
    }
  }

const  urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');

console.log("Patient ID:", patientId);

//Retrieving the patient details based on the patientId
const patientDocRef = doc(db, "appointments", patientId);

getDoc(patientDocRef)
  .then((doc) => {
    if (doc.exists()) {
      const appointmentData = doc.data();

      // Populate the input fields on the edit page with patientData
      document.getElementById("doctor").value = appointmentData.doctorId;
      document.getElementById("doctor").value = appointmentData.doctorName;
      document.getElementById("doctor").value = appointmentData.doctorSpeciality;
      document.getElementById('view_name').value = appointmentData.name;
      document.getElementById('view_phoneNumber').value = appointmentData.cell;
      document.getElementById('view_appointmentDate').value = appointmentData.date;
      document.getElementById('view_symptoms').value = appointmentData.symptoms;
      document.getElementById('view_appointmentType').value = appointmentData.appointmentType;
      document.getElementById('view_status').value = appointmentData.status;
    } else {
      console.error("Appointment document not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching appointment data: ", error);
  });

  
//calling the form id form editing patient data
const updatePatientForm = document.getElementById('updateAppointment-form');

updatePatientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Form submitted'); // Add this line for debugging

    const doctorId = document.getElementById("doctor").value;
    const doctorName = document.getElementById("doctor").selectedOptions[0].dataset.doctorName;
    const doctorSpeciality = document.getElementById("doctor").selectedOptions[0].dataset.doctorSpeciality;
    const updatedPatientName = document.getElementById('view_name').value;
    const updatedAppointmentDate = document.getElementById('view_appointmentDate').value;
    const updatedPhoneNumber = document.getElementById('view_phoneNumber').value;
    const updatedSymptoms= document.getElementById('view_symptoms').value;
    const updatedAppointmentType = document.getElementById('view_appointmentType').value;
    const updatedStatus = document.getElementById('view_status').value;

    //Updating the patient data in Firestore
    updateDoc(patientDocRef, {
        appointmentType  : updatedAppointmentType,
        cell             : updatedPhoneNumber,
        date             : updatedAppointmentDate,
        doctorId         : doctorId,
        doctorName       : doctorName,
        doctorSpeciality : doctorSpeciality,
        name             : updatedPatientName, 
        patientId        : patientId,
        status           : updatedStatus,
        symptoms        : updatedSymptoms,
    })
    .then(() => {
        alert("Patient data upated successfully.");
        window.location.href = "doc_appointments.html";
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
            populateDoctorsDropdown();
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


