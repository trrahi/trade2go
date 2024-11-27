console.log("Tämän pitäisi näkyä selaimen consolissa, että skripti toimii");

// Kirjautumislomakkeen lähetys
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
	e.preventDefault();

	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	// Create a new XMLHttpRequest object
	const xhr = new XMLHttpRequest();

	// Configure it: POST-request for the URL
	xhr.open("POST", "https://trade2go.onrender.com/api/login", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	// Handle the response
	xhr.onload = function () {
		if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			const { token, userName, firstName } = response;

			// Tallenna token ja käyttäjän nimi localStorageen
			localStorage.setItem("token", token);
			localStorage.setItem("userName", userName);

			// Ohjaa käyttäjä etusivulle
			window.location.href = "itembox.html";
		} else {
			document.getElementById("loginError").textContent = "Invalid login credentials.";
		}
	};

	// Handle network errors
	xhr.onerror = function () {
		document.getElementById("loginError").textContent = "An error occurred during the request.";
	};

	// Send the request with the login data
	const requestData = JSON.stringify({ email: email, password: password });
	xhr.send(requestData);
});




// // Rekisteröintilomakkeen lähetys
// document.getElementById("registerForm")?.addEventListener("submit", function (e) {
// 	e.preventDefault();

// 	const userName = document.getElementById("userName").value;
// 	const firstName = document.getElementById("firstName").value;
// 	const lastName = document.getElementById("lastName").value;
// 	const email = document.getElementById("email").value;
// 	const phoneNumber = document.getElementById("phoneNumber").value;
// 	const password = document.getElementById("password").value;

// 	axios
// 		.post("http://localhost:3003/api/users", {
// 			userName: userName,
// 			firstName: firstName,
// 			lastName: lastName,
// 			email: email,
// 			phoneNumber: phoneNumber,
// 			password: password
// 		})
// 		.then((response) => {
// 			// Rekisteröinti onnistui, siirrytään kirjautumissivulle
// 			window.location.href = "login.html";
// 		})
// 		.catch((error) => {
// 			document.getElementById("registerError").textContent = "Rekisteröinti epäonnistui. Yritä uudelleen.";
// 		});
// });


// Rekisteröintilomakkeen lähetyss
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
	e.preventDefault();

	const userName = document.getElementById("userName").value;
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;
	const phoneNumber = document.getElementById("phoneNumber").value;
	const password = document.getElementById("password").value;

	const xhr = new XMLHttpRequest();

	xhr.open("POST", "https://trade2go.onrender.com/api/users", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onload = function () {
		if (xhr.status === 200 || xhr.status === 201) {
			window.location.href = "https://trade2go.onrender.com/login.html";
		} else {
			document.getElementById("registerError").textContent = "Rekisteröinti epäonnistui. Yritä uudfelleen";
		}
	};

	xhr.onerror = function () {
		document.getElementById("registerError").textContent = "network error. Yritä uudelleen";
	};

	const requestData = JSON.stringify({
		userName: userName,
		firstName: firstName,
		lastName: lastName,
		email: email,
		phoneNumber: phoneNumber,
		password: password,
	});

	xhr.send(requestData);
});
