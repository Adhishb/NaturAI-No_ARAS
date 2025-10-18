// careschedule_entities.jsx

// CareSchedule Schema Object
const CareScheduleSchema = {
  name: "CareSchedule",
  type: "object",
  properties: {
    user_plant_id: { type: "string", description: "Reference to UserPlant" },
    plant_name: { type: "string", description: "Name of the plant" },
    task_type: {
      type: "string",
      enum: [
        "watering",
        "fertilizing",
        "pruning",
        "harvesting",
        "sunlight_check",
        "repotting",
      ],
      description: "Type of care task",
    },
    scheduled_date: {
      type: "string",
      format: "date",
      description: "When the task is scheduled",
    },
    completed: {
      type: "boolean",
      default: false,
      description: "Whether task is completed",
    },
    completed_date: {
      type: "string",
      format: "date",
      description: "When the task was completed",
    },
    notes: { type: "string", description: "Additional notes" },
    recurring: {
      type: "boolean",
      default: false,
      description: "Whether this is a recurring task",
    },
    recurrence_days: {
      type: "number",
      description: "Days between recurrences",
    },
  },
  required: ["plant_name", "task_type", "scheduled_date"],
  rls: {
    read: { created_by: "{{user.email}}" },
    write: { created_by: "{{user.email}}" },
  },
};

// Render schema visually
const container = document.getElementById("careschedule-list");

const renderCareScheduleSchema = (schema) => {
  const wrapper = document.createElement("div");
  wrapper.className = "careschedule-schema";

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

renderCareScheduleSchema(CareScheduleSchema);
