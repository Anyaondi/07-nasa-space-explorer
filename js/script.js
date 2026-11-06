
const API_KEY = "hhKDg8fJC66BnbwGWBmF9pBpj8c9QTdttQ9nBdnq";
const NASA_API_URL = "https://api.nasa.gov/planetary/apod";

// Get HTML elements
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const gallery = document.getElementById("gallery");
const button = document.querySelector(".filters button");

// Keep the starter date picker functionality
setupDateInputs(startInput, endInput);

// Extra Credit: Random Space Facts
const spaceFacts = [
  "One day on Venus is longer than one year on Venus!",
  "The Sun contains about 99.8% of the mass in our solar system.",
  "Neptune has some of the fastest winds in the solar system.",
  "A day on Jupiter lasts approximately 10 hours.",
  "Light from the Sun takes about 8 minutes to reach Earth."
];

const factSection = document.createElement("div");
factSection.className = "space-fact";
factSection.textContent =
  "🚀 Did You Know? " +
  spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

gallery.before(factSection);

// Create modal
const modal = document.createElement("div");
modal.className = "modal";
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-label", "NASA picture details");
modal.hidden = true;
document.body.appendChild(modal);

function closeModal() {
  modal.hidden = true;
  modal.replaceChildren();
  document.body.style.overflow = "";
}

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

// Open modal when an image is clicked
function openModal(item) {
  modal.replaceChildren();

  const content = document.createElement("div");
  content.className = "modal-content";

  const closeButton = document.createElement("button");
  closeButton.className = "close-modal";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", closeModal);
  content.appendChild(closeButton);

  const title = document.createElement("h2");
  title.textContent = item.title;
  content.appendChild(title);

  const date = document.createElement("p");
  date.textContent = item.date;
  content.appendChild(date);

  if (item.media_type === "image") {
    const image = document.createElement("img");
    image.src = item.hdurl || item.url;
    image.alt = item.title;
    content.appendChild(image);
  } else {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Watch NASA Video";
    content.appendChild(link);
  }

  const explanation = document.createElement("p");
  explanation.textContent = item.explanation;
  content.appendChild(explanation);

  modal.appendChild(content);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

// Display NASA images
function displayGallery(data) {
  gallery.replaceChildren();

  if (!data.length) {
    gallery.textContent = "No space images found for these dates.";
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("button");
    card.className = "space-card";
    card.type = "button";

    if (item.media_type === "image") {
      const image = document.createElement("img");
      image.src = item.url;
      image.alt = item.title;
      image.loading = "lazy";
      card.appendChild(image);
    } else {
      const videoLabel = document.createElement("div");
      videoLabel.className = "video-placeholder";
      videoLabel.textContent = "▶ NASA Space Video";
      card.appendChild(videoLabel);
    }

    const title = document.createElement("h3");
    title.textContent = item.title;

    const date = document.createElement("p");
    date.textContent = item.date;

    card.append(title, date);
    card.addEventListener("click", () => openModal(item));

    gallery.appendChild(card);
  });
}

// Fetch NASA images
async function getSpaceImages(startDate, endDate) {
  gallery.textContent = "🔄 Loading space photos...";
  button.disabled = true;

  const url = `${NASA_API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    displayGallery(Array.isArray(data) ? data : [data]);

  } catch (error) {
    gallery.textContent =
      "Unable to load NASA images. Please try again.";
    console.error("NASA API Error:", error);

  } finally {
    button.disabled = false;
  }
}

// Connect the Get Space Images button
button.addEventListener("click", () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert("Please select both dates.");
    return;
  }

  if (startDate > endDate) {
    alert("Start date must be before end date.");
    return;
  }

  getSpaceImages(startDate, endDate);
});
