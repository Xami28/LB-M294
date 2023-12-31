const loginUrl = "http://localhost:2941/auth/login";
const apiUrl = "http://localhost:2940/api/v2/entities";

function loginAndShowApp() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      const { accessToken } = data;

      sessionStorage.setItem("accessToken", accessToken);

      document.getElementById("login-container").style.display = "none";
      document.getElementById("content-container").style.display = "block";

      fetchAndCreateButtons();
      refreshPageAfter30s();
    })
    .catch((error) => {
      console.error("Login failed:", error);
      document.getElementById("wrongPasswordLabel").style.display = "block";
    });
}

function refreshPageAfter30s() {
  setTimeout(function () {
    alert("Diese Session ist abgelaufen. Der AccessToken ist nur 30s gültig.");
    location.reload();
  }, 30000);
}
