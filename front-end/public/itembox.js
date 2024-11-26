document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    // Jos token puuttuu, ohjataan käyttäjä takaisin kirjautumissivulle
    if (!token) {
        alert("Sinun täytyy kirjautua sisään päästäksesi tälle sivulle.");
        window.location.href = "login.html";
    }

    // Kirjaudu ulos -nappulan toiminnallisuus
    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", () => {
        // Poistetaan token localStoragesta
        localStorage.removeItem("token");

        // Ohjataan käyttäjä takaisin kirjautumissivulle
        alert("Olet kirjautunut ulos.");
        window.location.href = "login.html";
    });
});


// "Lisää uusi esine" näkymä aukeaa kun painetaan "Lisää Esine" nappia
document.getElementById('add-item-button').addEventListener('click', () => {
    $('#addItemModal').modal('show');
});



// tavaran lisäys 
document.getElementById('add-item-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemDesc = document.getElementById('item-desc').value;
    const imgUrl = document.getElementById('img-url').value;

    const itemToBeAdded = {
        itemName,
        itemDesc,
        imgUrl,
    };

    const token = localStorage.getItem('token')
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    try {
        const response = await fetch('http://localhost:3003/api/items', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(itemToBeAdded), 
        });

        if (!response.ok) {
            throw new Error('Virhe tavaran lisäämisessä');
        }

        $('#addItemModal').modal('hide'); 
        fetchItems(); 
    } catch (error) {
        console.error('Virhe tavaran lisäämisessä:', error);
        alert('Epäonnistuminen tavaran lisäämisessä');
    }
});


// Funktio esineiden esittämiseen
function displayItems(items) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-box');

        const itemName = document.createElement('h3');
        itemName.textContent = item.itemName;
        itemDiv.appendChild(itemName);

        const itemDesc = document.createElement('p');
        itemDesc.textContent = item.itemDesc;
        itemDiv.appendChild(itemDesc);

        if (item.imgUrl) {
            const itemImage = document.createElement('img');
            itemImage.src = item.imgUrl;
            itemImage.alt = `${item.itemName} Image`;
            itemImage.classList.add('item-image'); 
            itemDiv.appendChild(itemImage);
        }

        const userInfo = document.createElement('p');
        userInfo.classList.add('user-info');
        userInfo.textContent = `Ilmoittaja: ${item.user.userName} (${item.user.email})`;
        itemDiv.appendChild(userInfo);

        const tradeBtn = document.createElement('button');
        tradeBtn.classList.add('btn', 'btn-green');
        tradeBtn.textContent = 'Vaihda';
        tradeBtn.onclick = () => alert('Initiate trade for ' + item.itemName);
        itemDiv.appendChild(tradeBtn);

        container.appendChild(itemDiv);
    });
}

function fetchItems() {
	fetch("http://localhost:3003/api/items")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Tavaroiden hakeminen epäonnistui")
			}
			return response.json() 
		})
		.then((data) => {
			displayItems(data) 
		})
		.catch((error) => {
			console.error("Virhe tavaroiden hakemisessa:", error)
			alert("Tavaroiden hakeminen epäonnistui")
		})
}

// Kutsuu fetchItems funktiota ladatakseen esineet sivun latauksen yhteydessä
fetchItems();

// Tämä koodi käsittelee käyttäjän klikkausta "my-items-button" -painikkeessa.
// Se avaa modaalin ja lataa kohteet näyttöön käyttäen autentikointitunnusta,
// joka haetaan localStoragesta. Latausviesti näytetään modaalin sisällä ennen tietojen hakemista.
document.getElementById('my-items-button').addEventListener('click', async () => {
    const modal = document.getElementById('items-modal');
    const container = document.getElementById('modal-items-container');
    container.innerHTML = '<p>Ladataan...</p>'; 

    const token = localStorage.getItem('token'); 
    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    try {
        const response = await fetch('http://localhost:3003/api/items', {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Virhe esineiden hakemisessa');
        }

        const allItems = await response.json();

        // Purkaa tunnuksen saadakseen kirjautuneen käyttäjän ID:n
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = tokenPayload.id;

        const userItems = allItems.filter(item => item.user.id === currentUserId);

        if (userItems.length === 0) {
            alert('Esineitä ei löytynyt.');
            return;
        }

        container.innerHTML = ''; 

        userItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-box');
            itemDiv.setAttribute('data-id', item.id); // Asettaa mukautetun data-attribuutin esineen ID:lle

            const itemName = document.createElement('h4');
            itemName.textContent = item.itemName;
            itemDiv.appendChild(itemName);

            const itemDesc = document.createElement('p');
            itemDesc.textContent = item.itemDesc;
            itemDiv.appendChild(itemDesc);

            if (item.imgUrl) {
                const img = document.createElement('img');
                img.src = item.imgUrl;
                img.alt = `${item.itemName} Image`;
                img.classList.add('item-image');
                itemDiv.appendChild(img);
            }

            //Luo poista nappula
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Poista';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.onclick = async () => {
                try {
                    // Tekee DELETE pyynnön käyttämällä "item.id" (ei "item._id")
                    const deleteResponse = await fetch(`http://localhost:3003/api/items/${item.id}`, {
                        method: 'DELETE',
                        headers: headers,
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('Virhe esineen poistamisessa');
                    }

                    // Kutsuu fetchItems, joka hakee ja renderöi esineet uudelleen
                    await fetchItems();
                    // Onnistuessa poistaa esineen DOM:ista (poistaa näkyvistä sivulla)
                    itemDiv.remove();
                    alert('Esine poistettu!');
                } catch (error) {
                    console.error('Virhe esineen poistamisessa:', error);

                    // Tiettyjen virhevastauksien käsittely
                    if (error.message === 'Virhe esineen poistamisessa') {
                        alert('Virhe tapahtui tavaran poistamisessa');
                    } else {
                        alert('Sinulla ei ole lupaa poistaa tätä esinettä tai esinettä ei löytynyt.');
                    }
                }
            };

            itemDiv.appendChild(deleteButton);

            container.appendChild(itemDiv);
        });

        modal.style.display = 'block';

        document.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

    } catch (error) {
        console.error('Virhe esineiden hakemisessa:', error);
        container.innerHTML = '<p>Kohteiden lataaminen epäonnistui. Yritä myöhemmin uudelleen.</p>';
    }
});


// Asettaa modaalin näkyvyyden piiloon, jolloin se sulkeutuu
document.querySelector('.close-btn').addEventListener('click', () => {
    const modal = document.getElementById('items-modal');
    modal.style.display = 'none';
});

// Sulkee modaalin, jos käyttäjä klikkaa sen ulkopuolelle
window.onclick = function(event) {
    const modal = document.getElementById('items-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Funktio, joka avaa modaalin ja täyttää sen tiedoilla valitusta esineestä
function openModal(item) {
    const modal = document.getElementById('item-modal');
    const modalName = document.getElementById('modal-item-name');
    const modalDesc = document.getElementById('modal-item-desc');
    const modalImg = document.getElementById('modal-item-img');
    const deleteButton = document.getElementById('modal-delete-btn');
    const closeButton = document.querySelector('.close-btn'); 

    // Aseta modaalin sisältö sen esineen perusteella, joka on välitetty funktiolle
    modalName.textContent = item.itemName;
    modalDesc.textContent = item.itemDesc;
    modalImg.src = item.imgUrl ? item.imgUrl : ''; 

    modal.style.display = 'block';

    // Poistonapin käsittely klikattaessa
    deleteButton.onclick = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Lähettää DELETE pyynnön backendiin
            // await axios.delete(`http://localhost:3003/api/items/${item.id}`, config);
            const deleteResponse = await fetch(`http://localhost:3003/api/items/${item.id}`, {
                method: "DELETE",
                headers: headers
            })

            fetchItems();

            closeModal();

            alert('Esine poistettu!');

        } catch (error) {
            console.error('Virhe tavaran poistossa:', error);

            if (error.response && error.response.status === 403) {
                alert('Sinulla ei ole lupaa poistaa tätä esinettä.');
            } else if (error.response && error.response.status === 404) {
                alert('Esinettä ei löytynyt.');
            } else {
                alert('Virhe tapahtui esineen poistamisessa.');
            }
        }
    };

    closeButton.addEventListener('click', closeModal);
}

// Modaalin sulkemisfunktio
function closeModal() {
    const modal = document.getElementById('item-modal');
    modal.style.display = 'none';
}


// Sulkee modaalin "x" nappia klikattaessa
document.querySelector('.close-btn').addEventListener('click', closeModal);

// Sulkee modaalin kun käyttäjä klikkaa sen ulkopuolelle
window.onclick = function(event) {
    const modal = document.getElementById('item-modal');
    if (event.target == modal) {
        closeModal();
    }
};


// Funktio esineen poistamiseen
async function deleteItem(itemId, itemElement) {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        const response = await fetch(`http://localhost:3003/api/items/${itemId}`, {
            method: "DELETE",
            headers: headers
        })
        itemElement.remove(); 
        alert('Esine poistui onnistuneesti');
    } catch (error) {
        console.error('Virhe tavaran poistamisessa:', error);
        alert('Epäonnistunut tavaran poisto');
    }
}
