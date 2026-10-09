// Sign up and log in (accounts stored in this browser)
document.addEventListener("DOMContentLoaded", () => {
  // Already signed in? Go straight to the dashboard.
  if (TF.getSession()) { window.location.href = "dashboard.html"; return; }

  const setErr = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim().toLowerCase();
      const password = document.getElementById("signupPassword").value;
      ["signupNameError", "signupEmailError", "signupPasswordError"].forEach(id => setErr(id, ""));

      if (name.length < 2) return setErr("signupNameError", "Name must be at least 2 characters.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("signupEmailError", "Enter a valid email address.");
      if (password.length < 6) return setErr("signupPasswordError", "Password must be 6+ characters.");

      const users = TF.getUsers();
      if (users.some(u => u.email === email)) return setErr("signupEmailError", "An account with this email already exists.");

      users.push({ name, email, password: await TF.hash(password), createdAt: new Date().toISOString() });
      TF.saveUsers(users);
      TF.toast("Account created! Please log in.", "#16a34a");
      setTimeout(() => (window.location.href = "login.html"), 1200);
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;
      setErr("loginEmailError", ""); setErr("loginPasswordError", "");

      const user = TF.getUsers().find(u => u.email === email);
      if (!user) { TF.toast("No account found. Please sign up first.", "#dc2626"); return; }
      if (user.password !== await TF.hash(password)) { setErr("loginPasswordError", "Incorrect password."); return; }

      TF.setSession(email);
      TF.toast("Login successful!", "#16a34a");
      setTimeout(() => (window.location.href = "dashboard.html"), 900);
    });
  }
});
