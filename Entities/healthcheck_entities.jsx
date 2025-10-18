// healthcheck_entities.jsx

// HealthCheck Schema Object
const HealthCheckSchema = {
  name: "HealthCheck",
  type: "object",
  properties: {
    userplant_id: {
      type: "string",
      description: "Reference to UserPlant entity being evaluated",
    },
    check_date: {
      type: "string",
      format: "date",
      description: "Date the health check was performed",
    },
    health_status: {
      type: "string",
      enum: ["excellent", "good", "fair", "poor"],
      description: "Detected health condition of the plant",
    },
    moisture_level: {
      type: "string",
      enum: ["dry", "moist", "wet"],
      description: "Soil moisture level observed",
    },
    sunlight_exposure: {
      type: "string",
      enum: ["low", "medium", "high"],
      description: "Amount of sunlight exposure recorded",
    },
    leaf_condition: {
      type: "string",
      enum: ["healthy", "yellowing", "wilted", "spotted"],
      description: "Visual leaf condition",
    },
    pest_presence: {
      type: "boolean",
      description: "Whether pests were detected during the check",
    },
    nutrient_deficiency: {
      type: "string",
      enum: ["none", "nitrogen", "phosphorus", "potassium", "other"],
      description: "Detected nutrient deficiency (if any)",
    },
    image_url: {
      type: "string",
      description: "Photo taken during the health check",
    },
    ai_diagnosis: {
      type: "string",
      description: "AI-based analysis result for plant health",
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "Suggested actions to improve plant health",
    },
  },
  required: ["userplant_id", "check_date", "health_status"],
  rls: {
    read: { created_by: "{{user.email}}" },
    write: { created_by: "{{user.email}}" },
  },
};

// Render schema visually
const container = document.getElementById("healthcheck-list");

const renderHealthCheckSchema = (schema) => {
  const wrapper = document.createElement("div");
  wrapper.className = "healthcheck-schema";

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

renderHealthCheckSchema(HealthCheckSchema);
