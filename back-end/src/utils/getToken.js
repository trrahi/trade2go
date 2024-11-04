// Toimii kaikkiin funktiooihin, joissa req-olio käytössä. Hommataan tokeni kirjautuneelta käyttäjältä. .get() on expressin metodi jolla saadaan tässä tapauksessa auktorisointi headerit. Jos auktorisointi OK, palauttaa ainoastaan tokenin ilman "Bearer"- alkuosaa.
const getTokenFrom = (req) => {
	const authorization = req.get("authorization")
	if (authorization && authorization.startsWith("Bearer")) {
		return authorization.replace("Bearer ", "")
	}
	return null
}

module.exports = getTokenFrom
