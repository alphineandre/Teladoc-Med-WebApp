import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, collection,  getDocs, getDoc, addDoc, setDoc, updateDoc } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

var DoctorName;
var doctor_speciality;

async function populatePatientDropdown() {
    const patientrDropdown = document.getElementById("patient");
    const patientRef = collection(db, "patients");
  
    try {
        const querySnapshot = await getDocs(patientRef);
        querySnapshot.forEach((doc) => {
            const option = document.createElement("option");
            option.value = doc.id;
           
            option.textContent = doc.data().name;
            patientrDropdown.appendChild(option);
  
            option.dataset.patientName = doc.data().name;
            option.dataset.patientEmail = doc.data().email;
            option.dataset.patientPhoneNumber = doc.data().phoneNumber;
            
        });
    } catch (error) {
        console.error("Error fetching doctors: ", error);
    }
  }

const  urlParams = new URLSearchParams(window.location.search);
const healthCareID = urlParams.get('id');

console.log("Patient ID:", healthCareID);



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
            DoctorName = userData.fullname;
            doctor_speciality = userData.speciality
            userUsernameElement.textContent = "Welcome, " + username;
            populatePatientDropdown();

            document.getElementById("DoctorName").value = DoctorName;
            document.getElementById("doctor_speciality").value = doctor_speciality;

//Retrieving the patient details based on the patientId
const healthCareDocRef = doc(db, "healthcare_providers", auth.currentUser.uid, "medical_records", healthCareID);

getDoc(healthCareDocRef)
  .then((doc) => {
    if (doc.exists()) {
      const medicalRecordData = doc.data();

      // Populate the input fields on the edit page with patientData
      document.getElementById("patient").value = medicalRecordData.patientId;
      document.getElementById("patient").value = medicalRecordData.patientName;
      document.getElementById("patient").value = medicalRecordData.phoneNumber;
      document.getElementById("patient").value = medicalRecordData.email;
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
    } else {
      console.error("Medical Record document not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching medical record data: ", error);
  });

  
//calling the form id form editing patient data
const updatePatientForm = document.getElementById('UpdateMedicalRecord-form');

updatePatientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('Form submitted'); // Add this line for debugging

    const patientId = document.getElementById("patient").value;
    const patientName = document.getElementById("patient").selectedOptions[0].dataset.patientName;
    const phoneNumber = document.getElementById("patient").selectedOptions[0].dataset.patientPhoneNumber;;
    const age = document.getElementById("update_age").value;
    const email = document.getElementById("patient").selectedOptions[0].dataset.patientEmail;
    const Appointment_Date = document.getElementById("update_Appointment_Date").value;
    const Appointment_Type = document.getElementById("update_Appointment_Type").value;
    const Symptoms = document.getElementById("update_Symptoms").value;
    const condtion = document.getElementById("update_condtion").value;
    const diagnosis = document.getElementById("update_diagnosis").value;
    const prescription = document.getElementById("update_prescription").value;
    const treatmentPlan = document.getElementById("update_treatmentPlan").value;
    const testResults = document.getElementById("update_testResults").value;
    const vitalSigns = document.getElementById("update_vitalSigns").value;
    const allergies = document.getElementById("update_allergies").value;
    const followUpInstructions = document.getElementById("update_followUpInstructions").value;
    const nextAppointment = document.getElementById("update_nextAppointment").value;
    const notes = document.getElementById("update_notes").value;
    const physical_Address = document.getElementById("update_Physical_Address").value;
    const Martial_Status = document.getElementById("update_Martial_Status").value;
    const createdAt = new Date().toISOString();

    //Updating the medicaal record data in Firestore
    updateDoc(healthCareDocRef, {
        doctorId : auth.currentUser.uid,
        doctorName: DoctorName,
        doctorSpeciality: doctor_speciality,
        patientId: patientId,
        patientName: patientName,
        phoneNumber: phoneNumber,
        age : age,
        email: email,
        physicalAddress: physical_Address,
        martial_Status: Martial_Status,
        Appointment_Date: Appointment_Date,
        appointmentType: Appointment_Type,
        Symptoms: Symptoms,
        HealthCondition: condtion,
        diagnosis: diagnosis,
        prescription: prescription,
        treatmentPlan: treatmentPlan,
        testResults: testResults,
        vitalSigns: vitalSigns,
        allergies: allergies,
        followUpInstructions: followUpInstructions,
        nextAppointment: nextAppointment,
        notes: notes,
        ModifiedAt: createdAt,
    })
    .then(() => {
        alert("Medical record data upated successfully.");
        window.location.href = "doc_medicalRecordReport.html";
    })
    .catch((error) => {
        console.error("Error updating  medical record data: ", error);
    });

});

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


