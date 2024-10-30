console.log("testi")

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
			const { token, user } = response.data

			// Tallenna token ja käyttäjän nimi localStorageen
			localStorage.setItem("token", token)
			localStorage.setItem("user", JSON.stringify(user))

			// Ohjaa käyttäjä etusivulle
			window.location.href = "dashboard.html"
		})
		.catch((error) => {
			document.getElementById("loginError").textContent = "Invalid login credentials."
		})
})

// Register form submit
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
	e.preventDefault()

	const firstName = document.getElementById("firstName").value
	const lastName = document.getElementById("lastName").value
	const email = document.getElementById("email").value
	const password = document.getElementById("password").value

	axios
		.post("http://localhost:3003/api/register", {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
		})
		.then((response) => {
			// Rekisteröinti onnistui, ohjaa kirjautumissivulle
			window.location.href = "login.html"
		})
		.catch((error) => {
			document.getElementById("registerError").textContent = "Registration failed. Try again."
		})
})
