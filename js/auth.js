function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error-msg");

  errorBox.textContent = "Logging in...";

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const doc = await db.collection("users").doc(userCredential.user.uid).get();
      const role = doc.data().role;
      errorBox.style.color = "green";
      errorBox.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "index.html";
        } else {
          window.location.href = "member-dashboard.html";
        }
      }, 1000);
    })
    .catch(error => {
      errorBox.style.color = "red";
      errorBox.textContent = error.message;
    });
}

function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const phone = document.getElementById("phone").value.trim();
  const packageType = document.getElementById("package").value.trim();
  const status = document.getElementById("signup-status");

  if (!name || !email || !password || !phone || !packageType) {
    status.textContent = "❌ Please fill in all fields.";
    status.style.color = "red";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      return db.collection("users").doc(uid).set({
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
      status.textContent = "🎉 Account created! Redirecting...";
      setTimeout(() => window.location.href = "login.html", 1500);
    })
    .catch(error => {
      status.textContent = "❌ " + error.message;
      status.style.color = "red";
    });
}

function resetPassword() {
  const email = prompt("Enter your email to reset your password:");
  if (!email) return;
  auth.sendPasswordResetEmail(email)
    .then(() => alert("✅ Password reset link sent!"))
    .catch(error => alert("❌ " + error.message));
}

function logoutUser() {
  auth.signOut().then(() => window.location.href = "login.html");
}

window.loginUser = loginUser;
window.registerUser = registerUser;
window.resetPassword = resetPassword;
window.logoutUser = logoutUser;
