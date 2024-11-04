console.log("Tämän pitäisi näkyä selaimen consolissa, että skripti toimii");

// Login form submit
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
	e.preventDefault()

	const email = document.getElementById("email").value
	const password = document.getElementById("password").value

	axios
		.post("http://localhost:3003/api/login", {
			email: email,
			password: password
		})
		.then((response) => {
			const { token, userName, firstName } = response.data

			// console.log(`Tämä on token ${token}`);
			// console.log(`Tämä on userName ${userName}`);
			// console.log(`Tämä on firstName ${firstName}`);

			// Tallenna token ja käyttäjän nimi localStorageen
			localStorage.setItem("token", token)
			localStorage.setItem("userName", userName)

			// Ohjaa käyttäjä etusivulle
			window.location.href = "dashboard.html"
		})
		.catch((error) => {
			document.getElementById("loginError").textContent = "Invalid login credentials."
		})
})



// Register form submit
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
	e.preventDefault();

	const userName = document.getElementById("userName").value;
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;
	const phoneNumber = document.getElementById("phoneNumber").value;
	const password = document.getElementById("password").value;

	axios
		.post("http://localhost:3003/api/users", {
			userName: userName,
			firstName: firstName,
			lastName: lastName,
			email: email,
			phoneNumber: phoneNumber,
			password: password
		})
		.then((response) => {
			// Successful registration, redirect to login page
			window.location.href = "login.html";
		})
		.catch((error) => {
			document.getElementById("registerError").textContent = "Registration failed. Try again.";
		});
});

