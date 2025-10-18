const { useState, useEffect } = React;

// Sample data (replace with real API call if desired)
const samplePlants = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    scientific_name: "Monstera deliciosa",
    description: "A tropical plant known for its split leaves.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Monstera_deliciosa2.jpg/800px-Monstera_deliciosa2.jpg",
  },
  {
    id: 2,
    name: "Snake Plant",
    scientific_name: "Dracaena trifasciata",
    description: "A hardy plant that thrives on neglect.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Sansevieria_trifasciata.jpg",
  },
  {
    id: 3,
    name: "Peace Lily",
    scientific_name: "Spathiphyllum wallisii",
    description: "A beautiful plant that purifies air.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/07/Peace_Lily.jpg",
  },
];

function PlantCard({ plant }) {
  return (
    <div className="card">
      <img src={plant.image} alt={plant.name} />
      <h3>{plant.name}</h3>
      <p>
        <em>{plant.scientific_name}</em>
      </p>
      <p>{plant.description}</p>
    </div>
  );
}

function PlantGrid({ plants }) {
  return (
    <div className="grid">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}

function PlantLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState(samplePlants);

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.scientific_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      plant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-page">
      <div className="library-container">
        <div className="header">
          <div className="header-icon">📚</div>
          <h1>Plant Library</h1>
          <p>
            Explore our extensive collection of {filteredPlants.length} plants
          </p>
        </div>

        <div className="search-box">
          <div style={{ position: "relative" }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search plants by name, scientific name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <PlantGrid plants={filteredPlants} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<PlantLibrary />);
