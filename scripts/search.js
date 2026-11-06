document.addEventListener("DOMContentLoaded", () => {
  const loggedOutNav = document.getElementById("loggedOutNav");
  const loggedInNav = document.getElementById("loggedInNav");
  const greetingText = document.getElementById("greetingText");
  const logoutBtn = document.getElementById("logoutBtn");

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchTitle = document.getElementById("searchTitle");
  const searchSubtitle = document.getElementById("searchSubtitle");
  const resultsContainer = document.getElementById("searchResultsContainer");

  // 1. Auth check
  function checkAuthState() {
    const savedData = localStorage.getItem("todo_current_user");

    if (savedData) {
      try {
        const userObj = JSON.parse(savedData);
        loggedOutNav.classList.add("d-none");
        loggedInNav.classList.remove("d-none");
        greetingText.textContent = "Hi " + (userObj.name || savedData);
      } catch (e) {
        loggedOutNav.classList.add("d-none");
        loggedInNav.classList.remove("d-none");
        greetingText.textContent = "Hi " + savedData;
      }
    } else {
      loggedOutNav.classList.remove("d-none");
      loggedInNav.classList.add("d-none");
      greetingText.textContent = "";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("todo_current_user");
      checkAuthState();
    });
  }

  // 2. Read search term from URL query parameter (?q=...)
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";

  if (searchInput && query) {
    searchInput.value = query;
  }

  // Allow searching again from inside search.html
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newQuery = searchInput.value.trim();
      if (newQuery) {
        window.location.href = `search.html?q=${encodeURIComponent(newQuery)}`;
      }
    });
  }

  // 3. Fetch search results from DummyJSON API
  async function searchRecipes() {
    if (!resultsContainer) return;

    if (!query) {
      searchTitle.textContent = "All Dishes";
      searchSubtitle.textContent = "Showing top recipes";
    } else {
      searchTitle.textContent = `Results for "${query}"`;
    }

    try {
      const endpoint = query
        ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`
        : `https://dummyjson.com/recipes?limit=20`;

      const response = await fetch(endpoint);
      const data = await response.json();

      resultsContainer.innerHTML = "";

      if (!data.recipes || data.recipes.length === 0) {
        searchSubtitle.textContent = "Found 0 dishes";
        resultsContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-emoji-frown display-4 text-warning"></i>
            <h4 class="mt-3">No dishes found</h4>
            <p class="text-muted">Try searching for "Chicken", "Pizza", or "Pasta".</p>
            <a href="index.html" class="btn btn-warning btn-sm mt-2">Go back to Home</a>
          </div>
        `;
        return;
      }

      searchSubtitle.textContent = `Found ${data.recipes.length} matching dish(es)`;

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

        resultsContainer.appendChild(col);
      });
    } catch (error) {
      console.error("Search fetch error:", error);
      resultsContainer.innerHTML = `
        <div class="col-12 text-center text-danger py-4">
          <p>Failed to load search results. Please check your connection.</p>
        </div>
      `;
    }
  }

  checkAuthState();
  searchRecipes();
});