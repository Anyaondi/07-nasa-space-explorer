const API_KEY = "hhKDg8fJC66BnbwGWBmF9pBpj8c9QTdttQ9nBdnq";
const NASA_API_URL = "https://api.nasa.gov/planetary/apod";

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

async function getSpaceImages(startDate, endDate) {
  const url = `${NASA_API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch NASA images");
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
getSpaceImages(startInput.value, endInput.value);
}