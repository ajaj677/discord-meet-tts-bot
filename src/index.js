const buttons = document.querySelectorAll(".button button");

function setActive(target) {
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn === target);
    btn.classList.toggle("inactive", btn !== target);
  });
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => setActive(btn));
});