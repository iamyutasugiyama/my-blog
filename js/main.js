const button = document.getElementById("dark-toggle");

button.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});