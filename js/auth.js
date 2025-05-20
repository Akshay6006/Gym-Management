function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error-msg");

  errorBox.textContent = "Logging in...";

  auth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const doc = await db.collection("users").doc(user.uid).get();

      if (!doc.exists) {
        throw new Error("❌ User document not found in Firestore.");
      }

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
    .then(cred => {
      const user = cred.user;
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        phone: phone,
        package: packageType,
        role: "member",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      status.style.color = "green";
      status.textContent = "✅ Signup successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "member-dashboard.html";
      }, 1500);
    })
    .catch(err => {
      console.error("Error during sign up:", err.message);
      status.style.color = "red";
      status.textContent = "❌ " + err.message;
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
