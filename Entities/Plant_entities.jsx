// Plant_entities.jsx

// Example schema object (can be fetched dynamically or stored in a backend)
const PlantSchema = {
  name: "Plant",
  type: "object",
  properties: {
    name: { type: "string", description: "Common name of the plant" },
    scientific_name: { type: "string", description: "Scientific botanical name" },
    category: {
      type: "string",
      enum: [
        "fruit",
        "flower",
        "vegetable",
        "herb",
        "succulent",
        "tree",
        "shrub",
        "vine",
        "grass",
        "fern",
      ],
      description: "Plant category",
    },
    image_url: { type: "string", description: "Image URL of the plant" },
    description: { type: "string", description: "Detailed description of the plant" },
    care_difficulty: {
      type: "string",
      enum: ["easy", "moderate", "hard"],
      description: "How difficult it is to care for this plant",
    },
    sunlight_needs: {
      type: "string",
      enum: ["full_sun", "partial_sun", "shade"],
      description: "Sunlight requirements",
    },
    water_frequency: {
      type: "string",
      enum: ["daily", "every_2_days", "weekly", "bi_weekly", "monthly"],
      description: "How often to water",
    },
    growth_season: { type: "string", description: "Best growing season" },
    harvest_time: { type: "string", description: "When to harvest (if applicable)" },
    ideal_temperature: { type: "string", description: "Ideal temperature range" },
    soil_type: { type: "string", description: "Recommended soil type" },
    characteristics: {
      type: "array",
      items: { type: "string" },
      description: "Plant characteristics like beautiful, fragrant, etc.",
    },
    benefits: {
      type: "array",
      items: { type: "string" },
      description: "Benefits of growing this plant",
    },
  },
  required: ["name", "category"],
  rls: {
    read: {},
    write: {
      user_condition: { role: "admin" },
    },
  },
};

// Example rendering
const plantListContainer = document.getElementById("plant-list");

const displaySchema = (schema) => {
  const div = document.createElement("div");
  div.className = "plant-schema";

  const title = document.createElement("h2");
  title.textContent = `${schema.name} Schema`;
  div.appendChild(title);

  const list = document.createElement("ul");
  for (const [key, value] of Object.entries(schema.properties)) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${key}</strong>: ${value.description || "No description"}`;
    list.appendChild(li);
  }

  div.appendChild(list);
  plantListContainer.appendChild(div);
};

displaySchema(PlantSchema);
