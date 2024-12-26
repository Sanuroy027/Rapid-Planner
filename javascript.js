
      function generateRecommendation() {
        const preference = document.getElementById("preference").value;
        const activity = document.getElementById("activity").value;
        const budget = document.getElementById("budget").value;
        const resultDiv = document.getElementById("result");
        const output = document.getElementById("output");

        if (!preference || !activity || !budget) {
          output.innerText = "Kindly make a choice for each field.";
          output.style.color = "red";
          resultDiv.classList.add("show", "animate");
          return;
        }

        const templates = {
          Beach: {
            Adventure: {
              Low: "Consider backpacking in Goa, India, where you can enjoy vibrant beaches, thrilling water sports, vibrant nightlife, and scenic sunsets on a budget!",
              Medium:
                "How about visiting Bali, Indonesia? Perfect for sandy beaches, thrilling water adventures, and cultural exploration.",
              High: "We recommend the Maldives for luxury beach resorts and unmatched adventure activities. Dive into crystal-clear waters!",
            },
            Relaxation: {
              Low: "Relax on the peaceful beaches of Gokarna, India. It's serene and affordable.",
              Medium:
                "Try Phuket, Thailand, for a blend of relaxation and local cuisine. Unwind on beautiful beaches.",
              High: "Opt for a luxury retreat in Seychelles. World-class spas and pristine beaches await!",
            },
          },
          Mountains: {
            Adventure: {
              Low: "Explore the rugged trails of Manali, India, perfect for budget-friendly trekking adventures.",
              Medium:
                "Head to Nepal for hiking and cultural immersion at a reasonable price.",
              High: "Visit the Swiss Alps for world-class skiing and breathtaking mountain views.",
            },
            Relaxation: {
              Low: "Relax in the quiet foothills of Himachal Pradesh, India, with cozy homestays and mountain views.",
              Medium:
                "Experience the charm of Rishikesh, India. Serene rivers and wellness retreats await.",
              High: "Enjoy the luxury of a private cabin in the Canadian Rockies or Lake Louise, Canada, with all the comforts you desire. Indulge in fine dining, spa retreats, and exclusive guided tours for a high-budget getaway.",
            },
          },
        };

        const recommendation =
          templates[preference]?.[activity]?.[budget] ||
          "Explore local travel options that suit your preferences and budget. Adventure awaits!";

        output.innerText = recommendation;
        resultDiv.classList.add("show", "animate");
      }

      let errorMessage = "";

      function clearInputs() {
        document.getElementById("preference").value = "";
        document.getElementById("activity").value = "";
        document.getElementById("budget").value = "";
        const resultDiv = document.getElementById("result");
        const output = document.getElementById("output");
        output.innerText = "";
        resultDiv.classList.remove("show", "animate");
      }
    