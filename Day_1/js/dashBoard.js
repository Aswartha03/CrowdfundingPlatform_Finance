import {auth,db} from "../firebaseConfig.js"
import {signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"
import {doc,setDoc,getDoc,deleteDoc,addDoc,collection,getDocs} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js" 

document.addEventListener("DOMContentLoaded",()=>{
    let container = document.getElementById("projects")
    let currentUser = null
    onAuthStateChanged(auth,async(user)=>{
        // console.log(currentUser)
        
        if(user){
            currentUser=user
            // console.log("Aswartha")
            let email = currentUser.email // no need
            let dataDoc = await getDoc(doc(db,"Users",currentUser.uid))
            // console.log(dataDoc)
            if(dataDoc.exists()){
                let userType = dataDoc.data().userType
                let name = dataDoc.data().name 
                document.getElementById("userName").innerText = name 
                document.getElementById("userType").innerText=userType
                console.log(userType)
                if(userType=="project-creater"){
                    // document.getElementById("projects").classList.remove("hidden")
                    document.getElementById("searchAndFilter").classList.add("hidden")
                    document.getElementById("container").classList.remove("hidden")
                    document.getElementById("heading").classList.remove("hidden")
                }
                else{
                    document.getElementById("searchAndFilter").classList.remove("hidden")
                    document.getElementById("container").classList.add("hidden")
                    document.getElementById("heading").classList.remove("hidden")
                }
                loadProject(user,userType)
            }
        }
        // redirecting to the login page
        else{
            // window.location.href="login.html"
        }
    })
    // load project 
    async function loadProject(project,type){
        container.innerText=""
        let projectRef = collection(db,"Projects")
        let queries = await getDocs(projectRef) 
        // whole document 
        queries.forEach((doc)=>{
            let projectData = doc.data()
            displayProjects(doc.id,projectData,project.uid,type)
        })

    }

    // display projects 
    function displayProjects(id,project,uid,type){
        let Div = document.createElement("div") 
        Div.classList.add("project")
        Div.innerHTML=`
            <h3> Project Title : ${project.title}</h3>
            <p> Project Id : ${project.projectId}</p>
            <p id=""> Project Description : ${project.projectDescription}</p>
            <p> Funding Goal : ${project.cost}</p>
            <p> Reward Amount : ${project.donationAmount}</p>
            <p  id=""> Reward Description : ${project.rewardDescription}</p>
            <h4> Project Phase : ${project.phaseTitle}</h4>
            <p> Estimate Date to Complete : ${project.estimatedDate}</p>
            <p  id=""> phase Description : ${project.phaseDescription}</p>
        `
        // add button 
        let contributeBtn = document.createElement("button")
        contributeBtn.classList.add("hidden")
        contributeBtn.innerText="Contribute"
        // adding button to project 
        Div.appendChild(contributeBtn)
        // showing contribute button only for backers 
        if(type!="project-creater"){
            contributeBtn.classList.remove("hidden")
        }
        else{
            contributeBtn.classList.add("hidden")
        }
        container.appendChild(Div)
    } 

    // adding project
    document.getElementById("heading").classList.add("hidden")
    let addBtn = document.getElementById("add-project-btn")
    
    addBtn.addEventListener("click",async()=>{
        document.getElementById("heading").classList.remove("hidden")
        document.getElementById("container").classList.add("hidden")
        // console.log("Lopala unna")
        // inputs taking 
        let projectTitle = document.getElementById("project-title").value.trim()
        let projectDescription = document.getElementById("project-description").value .trim()
        let projectCost = document.getElementById("funding-amount").value 
        let donationAmount = document.getElementById("reward-amount").value 
        let rewardDescription = document.getElementById("reward-desc").value.trim()
        let phaseTitle = document.getElementById("phase-title").value.trim()
        let estimatedDate  = document.getElementById("phase-date").value.trim()
        let phaseDescription  = document.getElementById("phase-description").value.trim()
        // error handling
        if(!projectTitle || !projectDescription || !projectCost || !donationAmount || !rewardDescription || !phaseTitle || !estimatedDate || !phaseDescription){
            document.getElementById("message").innerText = "Please fill in all the feilds..."
            return 
        }
        await addDoc(collection(db,"Projects"),{
            projectId : currentUser.uid,
            title:projectTitle,
            projectDescription:projectDescription,
            cost:projectCost,
            donationAmount:donationAmount,
            rewardDescription:rewardDescription,
            phaseTitle:phaseTitle,
            estimatedDate:estimatedDate,
            phaseDescription:phaseDescription
        })
        // clearing after ading
        projectTitle.innerText=""
        projectDescription.innerText=""
        projectCost.innerText=""
        donationAmount.innerText=""
        rewardDescription.innerText=""
        phaseTitle.innerText=""
        estimatedDate.innerText=""
        phaseDescription.innerText=""
        // loading 
        loadProject(currentUser,document.getElementById("userType").innerText)
    })
    
})
