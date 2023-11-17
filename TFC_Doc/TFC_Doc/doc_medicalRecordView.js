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


//Getting the patient id in order to display the patient details and edit it
const  urlParams = new URLSearchParams(window.location.search);
const medicalRecordId = urlParams.get('id');

  
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

//Retrieving the medical record details based on the patientId
const medicalRecordDocRef = doc(db, "healthcare_providers",  auth.currentUser.uid, "medical_records", medicalRecordId);

//Fetching the medical record data
getDoc(medicalRecordDocRef)
.then((doc) => {
    if(doc.exists()) {
        const medicalRecordData = doc.data();

        //Populate the input fields on the edit page with patientData
        document.getElementById("patient_name").value = medicalRecordData.patientName;
        document.getElementById("patient_phoneNumber").value = medicalRecordData.phoneNumber;
        document.getElementById("patient_Email").value = medicalRecordData.email;
        document.getElementById('DoctorName').value = medicalRecordData.doctorName;
        document.getElementById('doctor_speciality').value = medicalRecordData.doctorSpeciality;
        document.getElementById('update_age').value = medicalRecordData.age;
        document.getElementById('update_Physical_Address').value = medicalRecordData.physicalAddress;
        document.getElementById('update_Martial_Status').value = medicalRecordData.martial_Status;
        document.getElementById('update_Appointment_Date').value = medicalRecordData.Appointment_Date;
        document.getElementById('update_Appointment_Type').value = medicalRecordData.appointmentType;
        document.getElementById('update_Symptoms').value = medicalRecordData.Symptoms;
        document.getElementById('update_condtion').value = medicalRecordData.HealthCondition;
        document.getElementById('update_diagnosis').value = medicalRecordData.diagnosis;
        document.getElementById('update_prescription').value = medicalRecordData.prescription;
        document.getElementById('update_treatmentPlan').value = medicalRecordData.treatmentPlan;
        document.getElementById('update_allergies').value = medicalRecordData.allergies;
        document.getElementById('update_testResults').value = medicalRecordData.testResults;
        document.getElementById('update_vitalSigns').value = medicalRecordData.vitalSigns;
        document.getElementById('update_followUpInstructions').value = medicalRecordData.followUpInstructions;
        document.getElementById('update_nextAppointment').value = medicalRecordData.nextAppointment;
        document.getElementById('update_notes').value = medicalRecordData.notes;

        const emailIcon = document.getElementById("emailIcon");
        emailIcon.href =`mailto:${medicalRecordData.email}`;

        const phoneIcon = document.getElementById("phoneIcon");
        phoneIcon.href =`tel:${medicalRecordData.phoneNumber}`;

    } else{
        console.error("Appointment  document not found");
    }
})
.catch((error) => {
    console.error("Error fetching patient data: ", error);
})


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


