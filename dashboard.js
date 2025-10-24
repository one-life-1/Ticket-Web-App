// ======================================
// 📊 DASHBOARD SCRIPT (Modern Clean Logic)
// ======================================

// Run logic after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  verifySession();
  setupLogout();
  loadDashboardData();
});

// ===============================
// 🔐 Verify Session or Redirect
// ===============================
function verifySession() {
  const session = localStorage.getItem("ticketapp_session");

  if (!session) {
    showToast("Your session has expired — please log in again.", "#ef4444");
    setTimeout(() => {
      window.location.href = "loginn.html"; // Redirect to login page
    }, 1800);
  }
}

// ===============================
// 🚪 Logout Functionality
// ===============================
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("ticketapp_session");
    showToast("You’ve been logged out successfully.", "#64748b");
    setTimeout(() => {
      window.location.href = "loginn.html";
    }, 1500);
  });
}

// ===============================
// 📈 Load Dashboard Ticket Stats
// ===============================
function loadDashboardData() {
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  updateDashboardUI(stats);
}

// ===============================
// 🧮 Update the UI with Data
// ===============================
function updateDashboardUI({ total, open, inProgress, closed }) {
  setText("totalTickets", total);
  setText("openTickets", open);
  setText("inProgressTickets", inProgress);
  setText("closedTickets", closed);
}

// ===============================
// 🧰 Helper: Safe Text Setter
// ===============================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ===============================
// 🔔 Toast Notification Handler
// ===============================
function showToast(message, color = "#0f172a") {
  let toast = document.getElementById("toast");

  // Create toast element if it doesn’t exist
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.backgroundColor = color;
  toast.className = "toast show";

  // Fade out after 3s
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
