const express = require("express");
const router = express.Router();

router.get("/getCities", async (req, res) => {
  try {
    const query = "city in pakistan";
    const format = "json";
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=${format}&q=${query}`
    );

    if (!response.ok) {
      res.send(
        `Failed to fetch data from OpenStreetMap Nominatim API: ${response.status}`
      );
    }

    const data = await response.json();

    // Extract city names from the response
    const cities = data.map((result) => result.display_name);

    res.json({ data });
  } catch (error) {
    console.error(
      "Error fetching cities from OpenStreetMap Nominatim API:",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
