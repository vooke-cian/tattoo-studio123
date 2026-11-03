
// GOLDEN INK STUDIO - WEBSITE JAVASCRIPT

// Display the current year
document.getElementById("year").textContent =
  new Date().getFullYear();


// MOBILE MENU
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", function () {
  mainNav.classList.toggle("open");
});

// Close menu after selecting a link
document.querySelectorAll("#mainNav a").forEach(function (link) {
  link.addEventListener("click", function () {
    mainNav.classList.remove("open");
  });
});


// TATTOO GALLERY FILTERS
const filterButtons = document.querySelectorAll(".filter");
const tattooCards = document.querySelectorAll(".tattoo-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    tattooCards.forEach(function (card) {
      if (
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

  });
});


// TATTOO IDEA GENERATOR
const ideaForm = document.getElementById("ideaForm");

ideaForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const idea = document.getElementById("idea").value.trim();
  const style = document.getElementById("ideaStyle").value;
  const placement = document.getElementById("ideaPlace").value;

  if (!idea) {
    alert("Please describe your tattoo idea.");
    return;
  }

  const result = `
GOLDEN INK STUDIO
YOUR TATTOO DESIGN BRIEF

Your idea:
${idea}

Preferred style:
${style}

Body placement:
${placement}

Artist instructions:
Discuss the size, shading, details and final design
with your chosen tattoo artist before booking.

Thank you for choosing Golden Ink Studio.
`;

  document.getElementById("ideaResult").textContent = result;
});


// APPOINTMENT REQUEST FORM
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(bookingForm);

  const booking = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    artist: formData.get("artist"),
    message: formData.get("message")
  };

  const status = document.getElementById("bookingStatus");
  const submitButton = bookingForm.querySelector('button[type="submit"]');

  status.textContent = "Sending your request...";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(booking)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to send request.");
    }

    status.textContent =
      "Your consultation request has been received!";

    bookingForm.reset();

  } catch (error) {
    status.textContent =
      "The booking service is not configured yet. Please try again later.";
  } finally {
    submitButton.disabled = false;
  }
});
