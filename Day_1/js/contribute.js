
// let amount=0
document.addEventListener("DOMContentLoaded",()=>{
    let messageBox = document.getElementById("message-box")
    // messageBox.innerText=""
    document.getElementById("submit-btn").addEventListener("click",()=>{
        let donationAmount = document.getElementById("donateAmount").value;
        donationAmount = +(donationAmount)
        
        // stoting
        let prevAmount = +(localStorage.getItem("totalDonation")) || 0;
        let newAmount = prevAmount + donationAmount;
        localStorage.setItem("totalDonation", newAmount);
        if(donationAmount){
            messageBox.innerText="Thank you for Donation.."
            document.getElementById("donateAmount").value=""
            setTimeout(()=>{
                window.location.href="dashBoard.html"
            },1500)
        }
        else{
            messageBox.innerText="Please Enter the Amount (min=1).."
            return 
        }
    })
    let flag = true 
    document.getElementById("theme").addEventListener("click",()=>{
        if(flag){
            document.body.style.backgroundColor="gray"
            flag = false
        }
        else{
            document.body.style.backgroundColor="white"
            flag = true
        }
    })
})
// function getAmount() {
//     return amount
// }
// console.log(amount)
// export { getAmount }
