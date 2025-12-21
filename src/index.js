const meetBtn = document.querySelector(".selectMeet");
const discordBtn = document.querySelector(".selectDiscordVC");

function toggle(active, inactive) {
  active.classList.add("active");
  active.classList.remove("inactive");

  inactive.classList.remove("active");
  inactive.classList.add("inactive");
}

meetBtn.addEventListener("click", () => {
  toggle(meetBtn, discordBtn);
});

discordBtn.addEventListener("click", () => {
  toggle(discordBtn, meetBtn);
});
