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

//Declare the variables to be used to fetch the patient's name and phone number
var name;
var phoneNumber;

// Function to book an appointment
document.getElementById("appointment-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const doctorId = document.getElementById("doctor").value;
  const doctorName = document.getElementById("doctor").selectedOptions[0].dataset.doctorName;
  const doctorSpeciality = document.getElementById("doctor").selectedOptions[0].dataset.doctorSpeciality;
  const appointmentType = document.getElementById("appointmentType").value;
  const appointmentDate = document.getElementById("date").value;
  const reason = document.getElementById("Symptoms").value;
  const createdAt = new Date().toISOString();

  if (!appointmentDate || !Pname || !reason || !cellphone || !appointmentDate || !appointmentType) {
      alert("Please fill in all fields");
      return;
  }

  const selectedDate = new Date(appointmentDate);
  const currentDate = new Date();

  // Check if the selected date is less than the current date
  if (selectedDate < currentDate) {
      alert("Can't set a date that has already passed, choose a date which beyond the current date");
      return;
  }

  // Add the appointment to Firestore
  const appointmentsRef = doc(db, "appointments", auth.currentUser.uid);

  setDoc(appointmentsRef, {
      patientId : auth.currentUser.uid,
      doctorId: doctorId,
      doctorName: doctorName, // Store the doctor's name
      doctorSpeciality: doctorSpeciality, // Store the doctor's speciality
      appointmentType: appointmentType,
      cell: phoneNumber,
      date: appointmentDate,
      name: name,
      symptoms: reason,
      status: "pending",
      createdAt: createdAt,
  })
  
      .then(() => {
        
          alert("Appointment booked successfully");
          document.getElementById("appointment-form").reset();
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
            phoneNumber = userData.phoneNumber
            userUsernameElement.textContent = "Welcome, " + username;
            populateDoctorsDropdown();

            document.getElementById("name").value = name;
            document.getElementById("phone").value = phoneNumber;

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


