// Ticket create / edit / delete
document.addEventListener("DOMContentLoaded", () => {
  if (!TF.requireSession()) return;
  TF.setupLogout();
  renderTickets();
  document.getElementById("ticketForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("ticketList").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const i = Number(btn.dataset.index);
    if (btn.dataset.action === "edit") editTicket(i);
    if (btn.dataset.action === "delete") deleteTicket(i);
  });
  document.getElementById("cancelEdit").addEventListener("click", resetForm);
});

const STATUSES = ["open", "in_progress", "closed"];

function handleFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value.trim();
  const editIndex = document.getElementById("editIndex").value;

  clearErrors();
  let ok = true;
  if (!title) { showError("titleError", "Title is required"); ok = false; }
  if (!STATUSES.includes(status)) { showError("statusError", "Please choose a status"); ok = false; }
  if (!ok) return;

  const tickets = TF.getTickets();
  if (editIndex !== "") {
    const i = Number(editIndex);
    tickets[i] = { ...tickets[i], title, status, description, updatedAt: new Date().toISOString() };
    TF.toast("Ticket updated!", "#2563eb");
  } else {
    tickets.push({ title, status, description, createdAt: new Date().toISOString() });
    TF.toast("Ticket added!", "#22c55e");
  }
  TF.saveTickets(tickets);
  renderTickets();
  resetForm();
}

function renderTickets() {
  const list = document.getElementById("ticketList");
  const tickets = TF.getTickets();
  if (!tickets.length) {
    list.innerHTML = '<p style="text-align:center; color:#64748b;">No tickets yet. Add your first one above.</p>';
    return;
  }
  list.innerHTML = tickets.map((t, i) => `
    <div class="ticket-card">
      <h3>${TF.escape(t.title)}</h3>
      <span class="status-tag status-${STATUSES.includes(t.status) ? t.status : "open"}">${TF.escape(t.status.replace("_", " "))}</span>
      <p>${TF.escape(t.description) || "No description provided."}</p>
      <p style="font-size:0.85rem; color:#94a3b8;">Created: ${new Date(t.createdAt).toLocaleString()}</p>
      <div class="ticket-actions">
        <button class="edit" data-action="edit" data-index="${i}">Edit</button>
        <button class="delete" data-action="delete" data-index="${i}">Delete</button>
      </div>
    </div>`).join("");
}

function editTicket(i) {
  const t = TF.getTickets()[i];
  if (!t) return;
  document.getElementById("title").value = t.title;
  document.getElementById("status").value = t.status;
  document.getElementById("description").value = t.description || "";
  document.getElementById("editIndex").value = i;
  document.getElementById("saveBtn").textContent = "Update Ticket";
  document.getElementById("cancelEdit").style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTicket(i) {
  if (!confirm("Delete this ticket?")) return;
  const tickets = TF.getTickets();
  tickets.splice(i, 1);
  TF.saveTickets(tickets);
  renderTickets();
  resetForm();
  TF.toast("Ticket deleted.", "#dc2626");
}

function resetForm() {
  document.getElementById("ticketForm").reset();
  document.getElementById("editIndex").value = "";
  document.getElementById("saveBtn").textContent = "Add Ticket";
  document.getElementById("cancelEdit").style.display = "none";
  clearErrors();
}
function clearErrors() { document.querySelectorAll(".error").forEach(e => (e.textContent = "")); }
function showError(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg; }
