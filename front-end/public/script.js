import axios from "axios"

console.log("Testi");

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
const registerButton = document.getElementById("registerButton")

registerButton.addEventListener("click", function (e) {
	e.preventDefault()
	console.log(e);
	console.log("click happened");

	// const userName = document.getElementById("userName").value
	// const firstName = document.getElementById("firstName").value
	// const lastName = document.getElementById("lastName").value
	// const email = document.getElementById("email").value
	// const phoneNumber = document.getElementById("phoneNumber").value
	// const password = document.getElementById("password").value

	// console.log(userName);

	// axios
	// 	.post("http://localhost:3003/api/users", {
	// 		userName: userName,
	// 		firstName: firstName,
	// 		lastName: lastName,
	// 		email: email,
	// 		phoneNumber: phoneNumber,
	// 		password: password
			
	// 	})
	// 	.then((response) => {
	// 		console.log("perse");
	// 		// Rekisteröinti onnistui, ohjaa kirjautumissivulle
	// 		window.location.href = "login.html"
	// 	})
	// 	.catch((error) => {
	// 		document.getElementById("registerError").textContent = "Registration failed. Try again."
	// 	})
})
