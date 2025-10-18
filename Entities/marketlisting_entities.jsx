// marketlisting_entities.jsx

// MarketListing Schema Object
const MarketListingSchema = {
  name: "MarketListing",
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Title of the listing",
    },
    plant_category: {
      type: "string",
      enum: [
        "fruit",
        "flower",
        "vegetable",
        "herb",
        "succulent",
        "tree",
        "shrub",
        "seeds",
      ],
      description: "Category of item",
    },
    description: {
      type: "string",
      description: "Description of what's being sold",
    },
    price: {
      type: "number",
      description: "Price in local currency",
    },
    quantity: {
      type: "number",
      description: "Quantity available",
    },
    image_url: {
      type: "string",
      description: "Photo of the item",
    },
    location: {
      type: "string",
      description: "Seller's general location",
    },
    contact_email: {
      type: "string",
      description: "Contact email",
    },
    status: {
      type: "string",
      enum: ["available", "sold", "reserved"],
      default: "available",
      description: "Listing status",
    },
  },
  required: ["title", "plant_category", "price"],
  rls: {
    read: {},
    write: { created_by: "{{user.email}}" },
  },
};

// Render schema visually
const container = document.getElementById("marketlisting-list");

const renderMarketListingSchema = (schema) => {
  const wrapper = document.createElement("div");
  wrapper.className = "marketlisting-schema";

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

renderMarketListingSchema(MarketListingSchema);
