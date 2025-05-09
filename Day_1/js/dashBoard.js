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
                // console.log(userType)
                if(userType=="project-creater"){
                    // document.getElementById("projects").classList.remove("hidden")
                    document.getElementById("searchAndFilter").classList.add("hidden")
                    document.getElementById("container").classList.remove("hidden")
                    document.getElementById("heading").classList.remove("hidden")
                }
                else if(userType!="project-creater"){
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
        // console.log(queries)
        queries.forEach((doc)=>{
            // search and filter 
            
            let projectData = doc.data()
            displayProjects(projectData,type)
        })

    }

    // display projects 
    function displayProjects(project,type){
        // container.innerText=""
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
        contributeBtn.addEventListener("click",()=>{
            window.location.href="contribute.html"       
        })
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
    // document.getElementById("heading").classList.add("hidden")
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
        projectTitle=""
        projectDescription=""
        projectCost=""
        donationAmount=""
        rewardDescription=""
        phaseTitle=""
        estimatedDate=""
        phaseDescription=""
        // loading 
        loadProject(currentUser,document.getElementById("userType").innerText)
    })


     
    document.getElementById("searchAndFilter-btn").addEventListener("click",async()=>{
        let searchedQuery = document.getElementById("searchedQuery").value 
        // console.log(searchedQuery)
        let goalAmount = document.getElementById("goal").value 
        if(!searchedQuery && !goalAmount) {
            alert('Please select or enter a search term before applying filters...')
            return
        } 
        // console.log(goalAmount)
        let dataRef = collection(db,"Projects")
        let wholeDoc = await getDocs(dataRef)
        // checking searchedquery
         
       let searchedArray = [];
        searchedQuery = searchedQuery.trim().toLowerCase();
        if (searchedQuery) {
            wholeDoc.forEach((doc) => {
                let projectData = doc.data();
                // console.log(projectData.cost, typeof projectData.cost, typeof +projectData.cost);
                if (projectData.title && projectData.title.toLowerCase().includes(searchedQuery)) {
                    searchedArray.push(projectData);
                }
            })
        }
        // console.log(searchedArray)
        // filtering 
        let filterArray =[]
        if(searchedArray.length==0){
            wholeDoc.docs.filter((doc)=>{
                let projectData = doc.data()
                if(goalAmount=="all"){
                    filterArray.push(projectData)
                }
                else if(goalAmount=="<1000" && +(projectData.cost)<1000){
                        filterArray.push(projectData)
                }
                else if(goalAmount=="1000-5000" && +(projectData.cost)>=1000 && projectData.cost<=5000){
                        filterArray.push(projectData)
                }
                else if(goalAmount=="5000-10000" && +(projectData.cost)>=5000 && projectData.cost<=10000){
                        filterArray.push(projectData)
                }
                else if(goalAmount=="10000-25000" && +(projectData.cost)>=10000 && projectData.cost<=25000){
                        filterArray.push(projectData)
                }
                else{
                    if(+(projectData.cost)>25000 )
                        filterArray.push(projectData)
                }  
            })
        }
        if(goalAmount==""){
            filterArray=searchedArray
        }
        else if(searchedArray.length!=0){
            searchedArray.forEach((project)=>{
                // let projectData = doc.data()
                if(goalAmount=="all"){
                    filterArray.push(project)
                }
                else if(goalAmount=="<1000" && +(project.cost)<1000){
                    filterArray.push(project)
                }
                else if(goalAmount=="1000-5000" && +(project.cost)>=1000 && project.cost<=5000){
                    filterArray.push(project)
                }
                else if(goalAmount=="5000-10000" && +(project.cost)>=5000 && project.cost<=10000){
                    filterArray.push(project)
                }
                else if(goalAmount=="10000-25000" && +(project.cost)>=10000 && project.cost<=25000){
                    filterArray.push(project)
                }
                else if(+(project.cost)>25000){
                    filterArray.push(project)
                }  
            })
        }
        if(filterArray.length==0) alert("No Data Found")
        container.innerText=""
        let type = document.getElementById("userType").value
        filterArray.forEach((project)=>{
        displayProjects(project,type)})
        // console.log(filterArray,searchedArray)
        // clearing input boxes after searching and filtering
        document.getElementById("searchedQuery").value=""
        document.getElementById("goal").value =""
        })
        
});
    
        
    
    
    

