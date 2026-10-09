// Shared helpers for TicketForge (session, storage, toast)
const TF = {
  USERS_KEY: "ticketapp_users",
  SESSION_KEY: "ticketapp_session",

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.USERS_KEY)) || []; }
    catch { return []; }
  },
  saveUsers(users) { localStorage.setItem(this.USERS_KEY, JSON.stringify(users)); },

  getSession() {
    try { return JSON.parse(localStorage.getItem(this.SESSION_KEY)); }
    catch { return null; }
  },
  setSession(email) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({ email, at: Date.now() }));
  },
  clearSession() { localStorage.removeItem(this.SESSION_KEY); },

  ticketsKey() {
    const s = this.getSession();
    return s ? "tickets_" + s.email.toLowerCase() : "tickets_guest";
  },
  getTickets() {
    try { return JSON.parse(localStorage.getItem(this.ticketsKey())) || []; }
    catch { return []; }
  },
  saveTickets(t) { localStorage.setItem(this.ticketsKey(), JSON.stringify(t)); },

  async hash(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    return btoa(unescape(encodeURIComponent(text)));
  },

  escape(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },

  // Redirect to login if not signed in. Returns true when signed in.
  requireSession() {
    if (!this.getSession()) {
      this.toast("Please log in to continue.", "#ef4444");
      setTimeout(() => (window.location.href = "login.html"), 1200);
      return false;
    }
    return true;
  },

  setupLogout() {
    const btn = document.getElementById("logoutBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      this.clearSession();
      this.toast("You have been logged out.", "#64748b");
      setTimeout(() => (window.location.href = "login.html"), 1000);
    });
  },

  toast(message, color = "#334155") {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = message;
    t.style.backgroundColor = color;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 3000);
  }
};
