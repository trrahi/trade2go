console.log("Tämän pitäisi näkyä selaimen consolissa, että skripti toimii");

// Kirjautumislomakkeen lähetys
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
	e.preventDefault();

	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const xhr = new XMLHttpRequest();

	xhr.open("POST", "http://localhost:3003/api/login", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	// vastauksesta haetaan käyttäjän tiedot ja tallennetaan LS
	xhr.onload = function () {
		if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			const { token, userName, firstName } = response;

			localStorage.setItem("token", token);
			localStorage.setItem("userName", userName);

			// Ohjaa käyttäjä pääsivullee
			window.location.href = "itembox.html";
		} else {
			document.getElementById("loginError").textContent = "Käyttäjätunnus tai salasana väärät.";
		}
	};

	xhr.onerror = function () {
		document.getElementById("loginError").textContent = "Network error, sos!!!!.";
	};

	// Lähetetään kirjautumisen tiedot palvelimelle
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

	xhr.open("POST", "http://localhost:3003/api/users", true);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onload = function () {
		if (xhr.status === 200 || xhr.status === 201) {
			window.location.href = "login.html";
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
