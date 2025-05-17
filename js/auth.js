// Initialize Firebase Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Login function
function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error-msg");

  errorBox.style.color = "black";
  errorBox.textContent = "Logging in...";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      errorBox.style.color = "green";
      errorBox.textContent = "Login successful! Redirecting...";
      setTimeout(() => window.location.href = "index.html", 1000);
    })
    .catch(error => {
      errorBox.style.color = "red";
      errorBox.textContent = error.message;
    });
}

// ✅ Signup/Register function
function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const phone = document.getElementById("phone").value.trim();
  const packageType = document.getElementById("package").value.trim();
  const status = document.getElementById("signup-status");

  if (!name || !email || !password || !phone || !packageType) {
    status.style.color = "red";
    status.textContent = "❌ Please fill in all fields.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Save using UID to match security rules
      return db.collection("users").doc(user.uid).set({
        name,
        email,
        phone,
        package: packageType,
        role: "member",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      status.style.color = "limegreen";
      status.textContent = "";
      alert("🎉 Account created!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Signup Error:", error.message);
      status.style.color = "red";
      status.textContent = `Error: ${error.message}`;
    });
}

// ✅ Forgot Password function
function resetPassword() {
  const email = prompt("Enter your email to reset your password:");
  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("✅ Password reset link sent to your email."))
    .catch((error) => {
      console.error("Reset password error:", error.message);
      alert("❌ " + error.message);
    });
}

// ✅ Logout function
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  }).catch(error => {
    alert("❌ Logout failed: " + error.message);
  });
}

// ✅ Expose functions globally
window.loginUser = loginUser;
window.registerUser = registerUser;
window.resetPassword = resetPassword;
window.logoutUser = logoutUser;
