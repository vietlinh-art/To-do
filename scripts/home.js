document.addEventListener("DOMContentLoaded", () => {
  const loggedOutNav = document.getElementById("loggedOutNav");
  const loggedInNav = document.getElementById("loggedInNav");
  const greetingText = document.getElementById("greetingText");
  const logoutBtn = document.getElementById("logoutBtn");
  const menuContainer = document.getElementById("menu-container");

  // 1. Auth check
  function checkAuthState() {
    const savedData = localStorage.getItem("todo_current_user");

    if (savedData) {
      const userObj = JSON.parse(savedData);
      loggedOutNav.classList.add("d-none");
      loggedInNav.classList.remove("d-none");
      greetingText.textContent = "Hi " + userObj.name;
    } else {
      loggedOutNav.classList.remove("d-none");
      loggedInNav.classList.add("d-none");
      greetingText.textContent = "";
    }
  }

  // Handle Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("todo_current_user");
    checkAuthState();
  });

  // 2. Fetch 20 recipes from DummyJSON API
  async function loadMenu() {
    try {
      // ?limit=20 tells the API to return exactly 20 items
      const response = await fetch("https://dummyjson.com/recipes?limit=20");
      const data = await response.json();

      // Clear the loading spinner
      menuContainer.innerHTML = "";

      // Loop through each recipe and create a Bootstrap card
      data.recipes.forEach((recipe) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
          <div class="card h-100 shadow-sm border-0">
            <img
              src="${recipe.image}"
              class="card-img-top"
              alt="${recipe.name}"
              style="height: 220px; object-fit: cover;"
            />
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="card-title mb-0 fs-6 fw-bold">${recipe.name}</h5>
                <span class="badge bg-warning text-dark">★ ${recipe.rating}</span>
              </div>
              <p class="card-text text-secondary small flex-grow-1">
                ${recipe.cuisine} Cuisine • ${recipe.difficulty} • ${recipe.caloriesPerServing} cal
              </p>
              <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                <span class="fw-bold text-dark">$${(recipe.prepTimeMinutes + 5.99).toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-warning text-dark fw-semibold">Order Now</button>
              </div>
            </div>
          </div>
        `;

        menuContainer.appendChild(col);
      });
    } catch (error) {
      console.error("Error loading recipes:", error);
      menuContainer.innerHTML = `
        <div class="col-12 text-center text-danger">
          <p>Failed to load menu items. Please check your internet connection.</p>
        </div>
      `;
    }
  }

  // Run on page load
  checkAuthState();
  loadMenu();
});