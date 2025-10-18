document.addEventListener("DOMContentLoaded", () => {
  const plantGrid = document.getElementById("plant-grid");
  const searchBox = document.getElementById("search-box");
  const tabs = document.querySelectorAll(".tab");
  const quizDialog = document.getElementById("quiz-dialog");
  const filterDialog = document.getElementById("filter-dialog");

  const quizBtn = document.getElementById("quiz-btn");
  const closeQuiz = document.getElementById("close-quiz");
  const filterBtn = document.getElementById("filter-btn");
  const closeFilter = document.getElementById("close-filter");
  const applyFilters = document.getElementById("apply-filters");

  let selectedCategory = "all";
  let filters = { difficulty: "", sunlight: "" };

  const plants = [
    { name: "Rose", category: "flower", sunlight: "high", care_difficulty: "medium", description: "Classic red flower." },
    { name: "Basil", category: "herb", sunlight: "medium", care_difficulty: "easy", description: "Perfect for cooking!" },
    { name: "Aloe Vera", category: "succulent", sunlight: "high", care_difficulty: "easy", description: "Healing plant for skin." },
    { name: "Tomato", category: "vegetable", sunlight: "high", care_difficulty: "medium", description: "Grows delicious fruits." },
    { name: "Lavender", category: "flower", sunlight: "high", care_difficulty: "hard", description: "Fragrant purple blooms." },
  ];

  function renderPlants() {
    plantGrid.innerHTML = "";
    const term = searchBox.value.toLowerCase();

    const filtered = plants.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesDiff = !filters.difficulty || p.care_difficulty === filters.difficulty;
      const matchesSun = !filters.sunlight || p.sunlight === filters.sunlight;
      return matchesSearch && matchesCategory && matchesDiff && matchesSun;
    });

    if (filtered.length === 0) {
      plantGrid.innerHTML = "<p>No plants found 🌱</p>";
      return;
    }

    filtered.forEach((p) => {
      const card = document.createElement("div");
      card.className = "plant-card";
      card.innerHTML = `<h3>${p.name}</h3><p>${p.description}</p>`;
      plantGrid.appendChild(card);
    });
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      selectedCategory = tab.dataset.category;
      renderPlants();
    })
  );

  searchBox.addEventListener("input", renderPlants);

  quizBtn.addEventListener("click", () => quizDialog.showModal());
  closeQuiz.addEventListener("click", () => quizDialog.close());
  filterBtn.addEventListener("click", () => filterDialog.showModal());
  closeFilter.addEventListener("click", () => filterDialog.close());
  applyFilters.addEventListener("click", () => {
    filters = {
      difficulty: document.getElementById("filter-difficulty").value,
      sunlight: document.getElementById("filter-sunlight").value,
    };
    renderPlants();
    filterDialog.close();
  });

  renderPlants();
});
