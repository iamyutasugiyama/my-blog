const button = document.getElementById("dark-toggle");

button.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const search = document.getElementById("search");

if (search) {
  search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase();

    const posts = document.querySelectorAll(".post-card");

    posts.forEach(post => {
      const title = post.dataset.title.toLowerCase();

      if (title.includes(keyword)) {
        post.style.display = "block";
      } else {
        post.style.display = "none";
      }
    });
  });
}