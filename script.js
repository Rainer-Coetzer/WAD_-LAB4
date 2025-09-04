document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const first = document.getElementById("first").value.trim();
  const last = document.getElementById("last").value.trim();
  const email = document.getElementById("email").value.trim();
  const prog = document.getElementById("prog").value.trim();
  const year = document.querySelector("input[name='year']:checked")?.value;
  const interests = document.getElementById("interests").value.trim();
  let photo = document.getElementById("photo").value.trim();

  // Validation
  let valid = true;
  document.getElementById("err-first").textContent = first ? "" : "First name is required.";
  document.getElementById("err-last").textContent = last ? "" : "Last name is required.";
  document.getElementById("err-email").textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email.";
  document.getElementById("err-prog").textContent = prog ? "" : "Programme is required.";
  document.getElementById("err-year").textContent = year ? "" : "Please select a year.";

  if (!first || !last || !email || !prog || !year || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    valid = false;
    document.getElementById("live").textContent = "Please fix the errors before submitting.";
  }

  if (!valid) return;

  // If no URL is provided, use a placeholder
  if (!photo) {
    photo = "https://placehold.co/128";
  }

  // Create profile card
  const card = document.createElement("div");
  card.className = "card-person";
  card.innerHTML = `
    <img src="${photo}" alt="Profile Photo" width="128">
    <div>
      <h3>${first} ${last}</h3>
      <p><span class="badge">${prog}</span> <span class="badge">Year ${year}</span></p>
      <p>${interests || "No interests listed"}</p>
      <button class="remove-btn">Remove</button>
    </div>
  `;
  document.getElementById("cards").prepend(card);

  // Add row to summary table
  const tbody = document.querySelector("#summary tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${first} ${last}</td>
    <td>${prog}</td>
    <td>${year}</td>
    <td>${interests || "None"}</td>
    <td><button class="remove-btn">Remove</button></td>
  `;
  tbody.prepend(row);

  // Add remove event listener
  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
    row.remove();
  });
  row.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
    row.remove();
  });

  // Clear form
  document.getElementById("regForm").reset();
  document.getElementById("live").textContent = "Student added successfully.";
});

// Allow selecting image from local storage
const photoInput = document.getElementById("photo");
const localFileInput = document.createElement("input");
localFileInput.type = "file";
localFileInput.accept = "image/*";
photoInput.insertAdjacentElement("afterend", localFileInput);

localFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      photoInput.value = event.target.result; // Set the photo URL to the base64 string
    };
    reader.readAsDataURL(file);
  }
});
