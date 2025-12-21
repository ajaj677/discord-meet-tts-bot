const parentBtn = document.querySelector(".button")
const selectMeetBtn = document.querySelector(".selectMeet");
const selectDiscordBtn = document.querySelector(".selectDiscordVC");
console.log("Script loaded successfully");

const disableBtn = (BtnElement) => {
    if (BtnElement!=selectDiscordBtn) {
        BtnElement.disabled = true;
        BtnElement.style.backgroundColor = "Grey";
    } 
};

parentBtn.addEventListener("click", () => {
    disableBtn(selectDiscordBtn);
});


