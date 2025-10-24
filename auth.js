// Show toast message
function showToast(message, color = "#334155") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.background = color;
  toast.className = "toast show";
  setTimeout(() => (toast.className = toast.className.replace("show", "")), 3000);
}

// Helper: Redirect
function redirect(url) {
  window.location.href = url;
}

// ============= SIGNUP LOGIC =============
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // Reset errors
    document.getElementById("signupNameError").textContent = "";
    document.getElementById("signupEmailError").textContent = "";
    document.getElementById("signupPasswordError").textContent = "";

    // Validation
    if (name.length < 2) {
      document.getElementById("signupNameError").textContent = "Name must be at least 2 characters.";
      return;
    }
    if (!email.includes("@")) {
      document.getElementById("signupEmailError").textContent = "Invalid email format.";
      return;
    }
    if (password.length < 6) {
      document.getElementById("signupPasswordError").textContent = "Password must be 6+ characters.";
      return;
    }

    // Save to localStorage
    const user = { name, email, password };
    localStorage.setItem("ticketapp_user", JSON.stringify(user));
    showToast("Account created successfully!", "#16a34a");

    setTimeout(() => redirect("login.html"), 1500);
  });
}

// ============= LOGIN LOGIC =============
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";

    const storedUser = JSON.parse(localStorage.getItem("ticketapp_user"));

    if (!storedUser) {
      showToast("No account found. Please sign up first.", "#dc2626");
      return;
    }
    if (email !== storedUser.email || password !== storedUser.password) {
      showToast("Invalid email or password.", "#dc2626");
      return;
    }

    // Successful login → create session
    localStorage.setItem("ticketapp_session", "active");
    showToast("Login successful!", "#16a34a");

    setTimeout(() => redirect("dashboard.html"), 1500);
  });
}
