document.addEventListener("DOMContentLoaded", () => {
  const addDialog = document.getElementById("add-plant-dialog");
  const addBtn = document.getElementById("add-plant-btn");
  const closeDialog = document.getElementById("close-dialog");
  const plantGrid = document.getElementById("plants-grid");

  const stats = {
    total: 0,
    healthy: 0,
    needingWater: 0,
    readyToHarvest: 0,
  };

  function updateStats() {
    document.getElementById("total-plants").textContent = stats.total;
    document.getElementById("healthy-plants").textContent = stats.healthy;
    document.getElementById("needing-water").textContent = stats.needingWater;
    document.getElementById("ready-harvest").textContent = stats.readyToHarvest;
  }

  function addPlant(name) {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `<h3>${name}</h3><p>Health: Good 🌿</p>`;
    plantGrid.appendChild(card);

    stats.total++;
    stats.healthy++;
    updateStats();
  }

  addBtn.addEventListener("click", () => addDialog.showModal());
  closeDialog.addEventListener("click", () => addDialog.close());

  addDialog.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const plantName = document.getElementById("plant-name").value.trim();
    if (plantName) {
      addPlant(plantName);
      addDialog.close();
    }
  });

  // Example data initialization
  document.getElementById("welcome-message").textContent =
    "Welcome back, Gardener!";
  updateStats();
});
