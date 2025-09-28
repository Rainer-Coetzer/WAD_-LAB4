document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  const cardsContainer = document.getElementById("cards");
  const summaryBody = document.querySelector("#summary tbody");
  const liveRegion = document.getElementById("live");

  // Load students from localStorage on startup
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach((student) => renderStudent(student));

  form.addEventListener("submit", function (e) {
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
    document.getElementById("err-email").textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Invalid email.";
    document.getElementById("err-prog").textContent = prog ? "" : "Programme is required.";
    document.getElementById("err-year").textContent = year ? "" : "Please select a year.";

    if (!first || !last || !email || !prog || !year || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      valid = false;
      liveRegion.textContent = "Please fix the errors before submitting.";
    }

    if (!valid) return;

    if (!photo) photo = "https://placehold.co/128";

    const student = { first, last, email, prog, year, interests, photo };

    // Save to localStorage
    students.unshift(student);
    localStorage.setItem("students", JSON.stringify(students));

    // Render new student
    renderStudent(student);

    form.reset();
    liveRegion.textContent = "Student added successfully.";
  });

  function renderStudent(student) {
    // Card
    const card = document.createElement("div");
    card.className = "card-person";
    card.innerHTML = `
      <img src="${student.photo}" alt="Profile Photo" width="128">
      <div>
        <h3>${student.first} ${student.last}</h3>
        <p><span class="badge">${student.prog}</span> <span class="badge">Year ${student.year}</span></p>
        <p>${student.interests || "No interests listed"}</p>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </div>
    `;
    cardsContainer.prepend(card);

    // Table row
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.first} ${student.last}</td>
      <td>${student.prog}</td>
      <td>${student.year}</td>
      <td>${student.interests || "None"}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
      </td>
    `;
    summaryBody.prepend(row);

    // Remove events
    const remove = () => {
      card.remove();
      row.remove();
      students = students.filter(
        (s) => !(s.first === student.first && s.last === student.last && s.email === student.email)
      );
      localStorage.setItem("students", JSON.stringify(students));
    };
    card.querySelector(".remove-btn").addEventListener("click", remove);
    row.querySelector(".remove-btn").addEventListener("click", remove);

    // Edit events
    const edit = () => {
      document.getElementById("first").value = student.first;
      document.getElementById("last").value = student.last;
      document.getElementById("email").value = student.email;
      document.getElementById("prog").value = student.prog;
      document.querySelector(`input[name='year'][value='${student.year}']`).checked = true;
      document.getElementById("interests").value = student.interests;
      document.getElementById("photo").value = student.photo;

      remove();
      liveRegion.textContent = "Editing student — make changes and resubmit.";
    };
    card.querySelector(".edit-btn").addEventListener("click", edit);
    row.querySelector(".edit-btn").addEventListener("click", edit);
  }

  // Search/filter functionality
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search students by name or programme...";
  searchInput.style.margin = "1rem 0";
  document.body.insertBefore(searchInput, document.getElementById("cards"));

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    document.querySelectorAll(".card-person").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? "flex" : "none";
    });
    document.querySelectorAll("#summary tbody tr").forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? "table-row" : "none";
    });
  });

  // Local file upload (unchanged)
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
});
