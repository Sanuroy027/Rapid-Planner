
const openCageAPIKey = "205c094f4e83428297e5903115f8e748"; // Replace with your OpenCage API key

// Transport speeds (km/h)
const transportSpeeds = {
  Bike: 50,
  Car: 80,
  Train: 120,
  Flight: 800,
};

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function generateRecommendation() {
  const preference = document.getElementById("preference").value;
  const activity = document.getElementById("activity").value;
  const budget = document.getElementById("budget").value;
  const transport = document.getElementById("transport").value;
  const resultDiv = document.getElementById("result");
  const output = document.getElementById("output");
  const distanceElem = document.getElementById("distance");
  const timeElem = document.getElementById("time");

  const loader = document.getElementById("loader");
  // Show the loader
  loader.style.display = "block";
  resultDiv.classList.remove("show", "animate"); // Hide previous result

  if (!preference || !activity || !budget || !transport) {
    output.innerText = "Please select an option for all fields.";
    output.style.color = "red";
    loader.style.display = "none"; // Hide the loader
    resultDiv.classList.add("show", "animate");
    return;
  }

  const templates = {
    Mountains: {
      Adventure: {
        Low: { name: "Munsiyari, Uttarakhand" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Leh, Ladakh" },
      },
      Relaxation: {
        Low: { name: "Nainital, Uttarakhand" },
        Medium: { name: "Shimla, Himachal Pradesh" },
        High: { name: "Darjeeling, West Bengal" },
      },
      Hiking: {
        Low: { name: "Tirthan Valley, Himachal Pradesh" },
        Medium: { name: "Kedarkantha, Uttarakhand" },
        High: { name: "Roopkund, Uttarakhand" },
      },
      Skydiving: {
        Low: { name: "Bir Billing, Himachal Pradesh" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Nubra Valley, Ladakh" },
      },
      Scuba_Diving: {
        Low: { name: "Mussoorie, Uttarakhand" },
        Medium: { name: "Kullu, Himachal Pradesh" },
        High: { name: "Spiti Valley, Himachal Pradesh" },
      },
      Camping: {
        Low: { name: "Dhanaulti, Uttarakhand" },
        Medium: { name: "Tirthan Valley, Himachal Pradesh" },
        High: { name: "Zanskar Valley, Ladakh" },
      },
      Rock_climbing: {
        Low: { name: "Nainital, Uttarakhand" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Leh, Ladakh" },
      },
      Rafting: {
        Low: { name: "Rishikesh, Uttarakhand" },
        Medium: { name: "Tirthan Valley, Himachal Pradesh" },
        High: { name: "Zanskar River, Ladakh" },
      },
    },
    Beach: {
      Adventure: {
        Low: { name: "Varkala, Kerala" },
        Medium: { name: "Kochi, Kerala" },
        High: { name: "Goa" },
      },
      Relaxation: {
        Low: { name: "Alleppey, Kerala" },
        Medium: { name: "Kovalam, Kerala" },
        High: { name: "Andaman Islands" },
      },
      Hiking: {
        Low: { name: "Gokarna, Karnataka" },
        Medium: { name: "Dhanushkodi, Tamil Nadu" },
        High: { name: "Chilika Lake, Odisha" },
      },
      Skydiving: {
        Low: { name: "Pondicherry" },
        Medium: { name: "Goa" },
        High: { name: "Andaman Islands" },
      },
      Scuba_Diving: {
        Low: { name: "Kumarakom, Kerala" },
        Medium: { name: "Goa" },
        High: { name: "Havelock Island, Andaman" },
      },
      Camping: {
        Low: { name: "Alibaug, Maharashtra" },
        Medium: { name: "Gokarna, Karnataka" },
        High: { name: "Rishikesh, Uttarakhand" },
      },
      Rock_climbing: {
        Low: { name: "Daman, Gujarat" },
        Medium: { name: "Kovalam, Kerala" },
        High: { name: "Goa" },
      },
      Rafting: {
        Low: { name: "Varkala, Kerala" },
        Medium: { name: "Rishikesh, Uttarakhand" },
        High: { name: "Zanskar, Ladakh" },
      },
    },
    Forest: {
      Adventure: {
        Low: { name: "Jim Corbett, Uttarakhand" },
        Medium: { name: "Bandipur, Karnataka" },
        High: { name: "Sundarbans, West Bengal" },
      },
      Relaxation: {
        Low: { name: "Kabini, Karnataka" },
        Medium: { name: "Periyar, Kerala" },
        High: { name: "Sundarbans, West Bengal" },
      },
      Hiking: {
        Low: { name: "Silent Valley, Kerala" },
        Medium: { name: "Bandipur, Karnataka" },
        High: { name: "Valley of Flowers, Uttarakhand" },
      },
      Skydiving: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Kabini, Karnataka" },
        High: { name: "Chilika Lake, Odisha" },
      },
      Scuba_Diving: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Bandipur, Karnataka" },
        High: { name: "Sundarbans, West Bengal" },
      },
      Camping: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Kabini, Karnataka" },
        High: { name: "Sundarbans, West Bengal" },
      },
      Rock_climbing: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Biligiri Ranga, Karnataka" },
        High: { name: "Sundarbans, West Bengal" },
      },
      Rafting: {
        Low: { name: "Kabini, Karnataka" },
        Medium: { name: "Rishikesh, Uttarakhand" },
        High: { name: "Sundarbans, West Bengal" },
      },
    },
    Lake: {
      Adventure: {
        Low: { name: "Nainital, Uttarakhand" },
        Medium: { name: "Kodaikanal, Tamil Nadu" },
        High: { name: "Tawang, Arunachal Pradesh" },
      },
      Relaxation: {
        Low: { name: "Alleppey, Kerala" },
        Medium: { name: "Srinagar, Jammu & Kashmir" },
        High: { name: "Nainital, Uttarakhand" },
      },
      Hiking: {
        Low: { name: "Nainital, Uttarakhand" },
        Medium: { name: "Pondicherry" },
        High: { name: "Tawang, Arunachal Pradesh" },
      },
      Skydiving: {
        Low: { name: "Srinagar, Jammu & Kashmir" },
        Medium: { name: "Udhampur, Jammu & Kashmir" },
        High: { name: "Manali, Himachal Pradesh" },
      },
      Scuba_Diving: {
        Low: { name: "Kumarakom, Kerala" },
        Medium: { name: "Goa" },
        High: { name: "Havelock Island, Andaman" },
      },
      Camping: {
        Low: { name: "Kumarakom, Kerala" },
        Medium: { name: "Srinagar, Jammu & Kashmir" },
        High: { name: "Rishikesh, Uttarakhand" },
      },
      Rock_climbing: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Zanskar, Ladakh" },
      },
      Rafting: {
        Low: { name: "Rishikesh, Uttarakhand" },
        Medium: { name: "Srinagar, Jammu & Kashmir" },
        High: { name: "Zanskar River, Ladakh" },
      },
    },
    Snowy_Landscapes: {
      Adventure: {
        Low: { name: "Gulmarg, Jammu & Kashmir" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Leh, Ladakh" },
      },
      Relaxation: {
        Low: { name: "Mussoorie, Uttarakhand" },
        Medium: { name: "Kufri, Himachal Pradesh" },
        High: { name: "Leh, Ladakh" },
      },
      Hiking: {
        Low: { name: "Gulmarg, Jammu & Kashmir" },
        Medium: { name: "Kufri, Himachal Pradesh" },
        High: { name: "Chadar Trek, Ladakh" },
      },
      Skydiving: {
        Low: { name: "Pondicherry" },
        Medium: { name: "Goa" },
        High: { name: "Nubra Valley, Ladakh" },
      },
      Scuba_Diving: {
        Low: { name: "Nainital, Uttarakhand" },
        Medium: { name: "Rishikesh, Uttarakhand" },
        High: { name: "Zanskar River, Ladakh" },
      },
      Camping: {
        Low: { name: "Shimla, Himachal Pradesh" },
        Medium: { name: "Manali, Himachal Pradesh" },
        High: { name: "Spiti Valley, Himachal Pradesh" },
      },
      Rock_climbing: {
        Low: { name: "Coorg, Karnataka" },
        Medium: { name: "Bir Billing, Himachal Pradesh" },
        High: { name: "Leh, Ladakh" },
      },
      Rafting: {
        Low: { name: "Mussoorie, Uttarakhand" },
        Medium: { name: "Rishikesh, Uttarakhand" },
        High: { name: "Zanskar River, Ladakh" },
      },
    },
    Historical_Sites: {
      Adventure: {
        Low: { name: "Khajuraho, Madhya Pradesh" },
        Medium: { name: "Hampi, Karnataka" },
        High: { name: "Fatehpur Sikri, Uttar Pradesh" },
      },
      Relaxation: {
        Low: { name: "Alleppey, Kerala" },
        Medium: { name: "Srinagar, Jammu & Kashmir" },
        High: { name: "Rishikesh, Uttarakhand" },
      },
      Hiking: {
        Low: { name: "Sanchi, Madhya Pradesh" },
        Medium: { name: "Hampi, Karnataka" },
        High: { name: "Ajanta and Ellora Caves, Maharashtra" },
      },
      Skydiving: {
        Low: { name: "Khajuraho, Madhya Pradesh" },
        Medium: { name: "Hampi, Karnataka" },
        High: { name: "Fatehpur Sikri, Uttar Pradesh" },
      },
      Scuba_Diving: {
        Low: { name: "Goa" },
        Medium: { name: "Andaman Islands" },
        High: { name: "Havelock, Andaman" },
      },
      Camping: {
        Low: { name: "Hampi, Karnataka" },
        Medium: { name: "Khajuraho, Madhya Pradesh" },
        High: { name: "Rishikesh, Uttarakhand" },
      },
      Rock_climbing: {
        Low: { name: "Khajuraho, Madhya Pradesh" },
        Medium: { name: "Hampi, Karnataka" },
        High: { name: "Ajanta and Ellora Caves, Maharashtra" },
      },
      Rafting: {
        Low: { name: "Rishikesh, Uttarakhand" },
        Medium: { name: "Alleppey, Kerala" },
        High: { name: "Zanskar River, Ladakh" },
      },
    },
  };

  const locationData = templates[preference]?.[activity]?.[budget] || {
    name: "Unknown",
  };

  output.innerText = `Recommendation: ${locationData.name}`;
  output.style.color = "black";

  fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      locationData.name
    )}&key=${openCageAPIKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results[0]) {
        const destCoords = data.results[0].geometry;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              const distance = calculateDistance(
                userCoords.lat,
                userCoords.lng,
                destCoords.lat,
                destCoords.lng
              ).toFixed(2);

              const speed = transportSpeeds[transport];
              const travelTime = (distance / speed).toFixed(2);
              const hours = Math.floor(travelTime);
              const minutes = Math.round((travelTime - hours) * 60);

              distanceElem.innerText = `Distance: ${distance} km`;
              timeElem.innerText = `Estimated Time: ${hours} hours ${minutes} minutes`;
              resultDiv.classList.add("show", "animate");
              // Hide the loader after all data is processed
              loader.style.display = "none";
            },
            (error) => {
              console.error("Error getting user location:", error);
              distanceElem.innerText =
                "Unable to fetch your current location.";
              loader.style.display = "none"; // Hide the loader
            }
          );
        } else {
          distanceElem.innerText =
            "Geolocation is not supported by your browser.";
          loader.style.display = "none"; // Hide the loader
        }
      } else {
        distanceElem.innerText = "Distance not available.";
        timeElem.innerText = "Estimated time not available.";
        loader.style.display = "none"; // Hide the loader
      }
    })
    .catch((error) => {
      console.error("Error fetching location:", error);
      distanceElem.innerText = "Error fetching location details.";
      timeElem.innerText = "Error calculating travel time.";
      loader.style.display = "none"; // Hide the loader
    });
}

function clearInputs() {
  document.getElementById("preference").value = "";
  document.getElementById("activity").value = "";
  document.getElementById("budget").value = "";
  document.getElementById("transport").value = "";
  const resultDiv = document.getElementById("result");
  const output = document.getElementById("output");
  const distanceElem = document.getElementById("distance");
  const timeElem = document.getElementById("time");
  output.innerText = "";
  distanceElem.innerText = "";
  timeElem.innerText = "";
  resultDiv.classList.remove("show", "animate");
}
