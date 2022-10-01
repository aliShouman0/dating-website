// tags
const signup_section = document.getElementById("signup_section");
const new_account = document.getElementById("new_account");
const close = document.getElementById("close");


new_account.addEventListener("click", () => {
  signup_section.classList.remove("d-none");
})

close.addEventListener("click", () => {
  signup_section.classList.add("d-none");
})