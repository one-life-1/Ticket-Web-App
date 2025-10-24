// =============================
// 🎫 Ticket Management Script
// =============================
document.addEventListener("DOMContentLoaded", () => {
  verifySession();
  setupLogout();
  renderTickets();

  const form = document.getElementById("ticketForm");
  form.addEventListener("submit", handleFormSubmit);
});

// ✅ Session Check
function verifySession() {
  const session = localStorage.getItem("ticketapp_session");
  if (!session) {
    showToast("Your session has expired — please log in again.", "#ef4444");
    setTimeout(() => {
      window.location.href = "loginn.html";
    }, 1500);
  }
}

// 🚪 Logout
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("ticketapp_session");
    showToast("You have been logged out.", "#64748b");
    setTimeout(() => {
      window.location.href = "loginn.html";
    }, 1500);
  });
}

// =============================
// 🧾 Ticket CRUD Logic
// =============================
function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const status = document.getElementById("status").value.trim();
  const description = document.getElementById("description").value.trim();
  const editIndex = document.getElementById("editIndex").value;

  let isValid = true;
  clearErrors();

  if (!title) {
    showError("titleError", "Title is required");
    isValid = false;
  }

  if (!status || !["open", "in_progress", "closed"].includes(status)) {
    showError("statusError", "Valid status required");
    isValid = false;
  }

  if (!isValid) return;

  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  const newTicket = { title, status, description, createdAt: new Date().toISOString() };

  if (editIndex) {
    tickets[editIndex] = newTicket;
    showToast("Ticket updated successfully!", "#2563eb");
  } else {
    tickets.push(newTicket);
    showToast("Ticket added successfully!", "#22c55e");
  }

  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
  resetForm();
}

// =============================
// 🧩 Render Tickets
// =============================
function renderTickets() {
  const container = document.getElementById("ticketList");
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  container.innerHTML = "";

  if (tickets.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#64748b;">No tickets found.</p>`;
    return;
  }

  tickets.forEach((ticket, index) => {
    const card = document.createElement("div");
    card.classList.add("ticket-card");

    card.innerHTML = `
      <h3>${ticket.title}</h3>
      <span class="status-tag status-${ticket.status}">${ticket.status.replace("_", " ")}</span>
      <p>${ticket.description || "No description provided."}</p>
      <p style="font-size:0.85rem; color:#94a3b8;">Created: ${new Date(ticket.createdAt).toLocaleString()}</p>

      <div class="ticket-actions">
        <button class="edit" onclick="editTicket(${index})">Edit</button>
        <button class="delete" onclick="deleteTicket(${index})">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// =============================
// ✏️ Edit Ticket
// =============================
function editTicket(index) {
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const ticket = tickets[index];

  document.getElementById("title").value = ticket.title;
  document.getElementById("status").value = ticket.status;
  document.getElementById("description").value = ticket.description;
  document.getElementById("editIndex").value = index;

  document.getElementById("saveBtn").textContent = "Update Ticket";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =============================
// 🗑️ Delete Ticket
// =============================
function deleteTicket(index) {
  if (!confirm("Are you sure you want to delete this ticket?")) return;

  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.splice(index, 1);

  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
  showToast("Ticket deleted successfully!", "#dc2626");
}

// =============================
// 🧼 Helpers
// =============================
function resetForm() {
  document.getElementById("ticketForm").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("saveBtn").textContent = "Add Ticket";
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function showToast(message, color = "#0f172a") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.backgroundColor = color;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
