// userplant_entities.jsx

// UserPlant Schema Object
const UserPlantSchema = {
  name: "UserPlant",
  type: "object",
  properties: {
    plant_id: { type: "string", description: "Reference to Plant entity" },
    plant_name: { type: "string", description: "Name given by user to this plant" },
    plant_category: { type: "string", description: "Category of the plant" },
    planted_date: {
      type: "string",
      format: "date",
      description: "When the plant was planted",
    },
    location: {
      type: "string",
      description: "Where the plant is located (indoor, outdoor, balcony, etc.)",
    },
    image_url: {
      type: "string",
      description: "Photo of the user's actual plant",
    },
    notes: {
      type: "string",
      description: "User notes about the plant",
    },
    health_status: {
      type: "string",
      enum: ["excellent", "good", "fair", "poor"],
      default: "good",
      description: "Current health status",
    },
    last_watered: {
      type: "string",
      format: "date",
      description: "Last watering date",
    },
    next_watering: {
      type: "string",
      format: "date",
      description: "Next scheduled watering",
    },
    harvest_expected: {
      type: "string",
      format: "date",
      description: "Expected harvest date",
    },
  },
  required: ["plant_name"],
  rls: {
    read: { created_by: "{{user.email}}" },
    write: { created_by: "{{user.email}}" },
  },
};

// Render schema visually
const container = document.getElementById("userplant-list");

const renderUserPlantSchema = (schema) => {
  const wrapper = document.createElement("div");
  wrapper.className = "userplant-schema";

  const title = document.createElement("h2");
  title.textContent = `${schema.name} Schema`;
  wrapper.appendChild(title);

  const list = document.createElement("ul");
  for (const [key, value] of Object.entries(schema.properties)) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${key}</strong>: ${value.description || "No description"}`;
    list.appendChild(li);
  }

  wrapper.appendChild(list);
  container.appendChild(wrapper);
};

renderUserPlantSchema(UserPlantSchema);
