document.getElementById("regForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let userData = {
    name: name,
    email: email,
    password: password
  };

  // Get existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // AJAX POST (simulated)
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "dummyURL", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    users.push(userData);   // add new user
    localStorage.setItem("users", JSON.stringify(users));

    // Open new tab to show all users
    window.open("list.html", "_blank");
  };

  xhr.send(JSON.stringify(userData));
});


