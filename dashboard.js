// Dashboard stats
document.addEventListener("DOMContentLoaded", () => {
  if (!TF.requireSession()) return;
  TF.setupLogout();

  const user = TF.getUsers().find(u => u.email === TF.getSession().email);
  const hello = document.getElementById("welcomeName");
  if (hello && user) hello.textContent = user.name;

  const tickets = TF.getTickets();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("totalTickets", tickets.length);
  set("openTickets", tickets.filter(t => t.status === "open").length);
  set("inProgressTickets", tickets.filter(t => t.status === "in_progress").length);
  set("closedTickets", tickets.filter(t => t.status === "closed").length);
});
