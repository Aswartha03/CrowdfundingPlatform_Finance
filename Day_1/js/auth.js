import {auth,db} from "../firebaseConfig.js"
import {signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"
import {doc,setDoc,getDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js" 


window.addEventListener("DOMContentLoaded",()=>{
    let signupBtn = document.getElementById("signup-btn")
    let signinBtn = document.getElementById("login-btn")
    let logoutBtn =document.getElementById("logout-btn")
    // signup function 
    if(signupBtn){
        signupBtn.addEventListener("click",async()=>{
            let userName = document.getElementById("signup-name").value 
            let userEmail = document.getElementById("signup-email").value 
            let userPassword = document.getElementById("signup-password").value 
            let userType = document.getElementById("role").value 
            if (!userName || !userEmail || !userPassword) {
                document.getElementById("signup-message").innerText = "Please fill in all fields.";
                return;
            }
            try {
                // creation of an user
                let userCredentials= await createUserWithEmailAndPassword(auth,userEmail,userPassword) 
                let user = userCredentials.user 
                // storing user data in firestore 
                await setDoc(doc(db,"Users",user.uid),{
                    name:userName,
                    email:user.email,
                    userType:userType
                })
                // directing to login page
                window.location.href="login.html"
            } catch (error) {
                document.getElementById("signup-message").innerText=error.message
            }
        })
    }
    // signin function 
    if(signinBtn){
        signinBtn.addEventListener("click",async()=>{
            let email = document.getElementById("login-email").value
            let password = document.getElementById("login-password").value 
            try {
                await signInWithEmailAndPassword(auth,email,password)
                window.location.href="dashBoard.html"
            } catch (error) {
                document.getElementById("login-message").innerText=error.message
            }
        })
    }
    if(logoutBtn){
        logoutBtn.addEventListener("click",async()=>{
            try {
                await signOut(auth)
                window.location.href="login.html"
            } catch (error) {
                document.getElementById("logout-message").innerText=error.message
            }
        })
    }

})
// export let currentUser = null;

// onAuthStateChanged(auth, async (user) => {
//     currentUser = user;
//     // handle state
// });