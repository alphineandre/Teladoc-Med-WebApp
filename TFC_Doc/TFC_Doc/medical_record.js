import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth, signOut} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {getFirestore, doc, collection,  getDocs, getDoc, addDoc, setDoc } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

// Function to populate the doctor dropdown
// Function to populate the doctor dropdown
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

  // Function to book an appointment
document.getElementById("MedicalRecord-form").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const patientId = document.getElementById("patient").value;
    const patientName = document.getElementById("patient").selectedOptions[0].dataset.patientName;
    const phoneNumber = document.getElementById("patient").selectedOptions[0].dataset.patientPhoneNumber;;
    const age = document.getElementById("age").value;
    const email = document.getElementById("patient").selectedOptions[0].dataset.patientEmail;
    const Appointment_Date = document.getElementById("Appointment_Date").value;
    const Appointment_Type = document.getElementById("Appointment_Type").value;
    const Symptoms = document.getElementById("Symptoms").value;
    const condtion = document.getElementById("condtion").value;
    const diagnosis = document.getElementById("diagnosis").value;
    const prescription = document.getElementById("prescription").value;
    const treatmentPlan = document.getElementById("treatmentPlan").value;
    const testResults = document.getElementById("testResults").value;
    const vitalSigns = document.getElementById("vitalSigns").value;
    const allergies = document.getElementById("allergies").value;
    const followUpInstructions = document.getElementById("followUpInstructions").value;
    const nextAppointment = document.getElementById("nextAppointment").value;
    const notes = document.getElementById("notes").value;
    const physical_Address = document.getElementById("Physical_Address").value;
    const Martial_Status = document.getElementById("Martial_Status").value;
    const createdAt = new Date().toISOString();
  
    if (!DoctorName || !doctor_speciality || !age || !Appointment_Date 
        || !Appointment_Type || !Symptoms || !condtion || !diagnosis || !prescription || !treatmentPlan
        || !testResults || !vitalSigns || !allergies || !followUpInstructions || !nextAppointment || !notes
        || !physical_Address || !Martial_Status
        ) {
        alert("Please fill in all fields");
        return;
    }

    const selectedDate1 = new Date(nextAppointment);
    const currentDate = new Date();

  

    if (selectedDate1 < currentDate) {
      alert("Can't set a date that has already passed, choose a date which beyond the current date");
      return;
  }
  
    // Add the appointment to Firestore
    const medicalRecordRef = collection(db,"healthcare_providers", auth.currentUser.uid, "medical_records");
  
    addDoc(medicalRecordRef, {
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
        createdAt: createdAt,
    })
    
        .then(() => {
          
            alert("Medical Record Successfully Created");
            document.getElementById("MedicalRecord-form").reset();
        })
        .catch((error) => {
            console.error("Error booking appointment: ", error);
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
            DoctorName = userData.fullname;
            doctor_speciality = userData.speciality
            userUsernameElement.textContent = "Welcome, " + username;
            populatePatientDropdown();

            document.getElementById("DoctorName").value = DoctorName;
            document.getElementById("doctor_speciality").value = doctor_speciality;
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


