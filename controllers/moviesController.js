//connetto Database e Express
const { connected } = require("process");
const connection = require("../db/connection");

//funzione index
function index(req, res) {
	//imposto la query
	const sql = "SELECT * FROM `movies`";
	//eseguo la query
	connection.query(sql, (err, results) => {
		if (err) return res.status(500).json({ error: "Database query failed" });
		res.json(results);
		console.log(results);
	});
}
//funzione show
function show(req, res) {
	//recupero id
	const id = parseInt(req.params.id);
	//imposto la query
	const moviesSql =
		"SELECT id, title, director, genre, release_year, abstract FROM `movies` WHERE id = ? ";
	//eseguo la query
	connection.query(moviesSql, [id], (err, moviesResults) => {
		//imposto messaggi di errore
		if (err) return res.status(500).json({ error: "Database query failed" });
		if (moviesResults.length === 0)
			return res.status(404).json({ error: "Movie not found" });
		//visualizzo il film cercato
		const movie = moviesResults[0];
		res.json(movie);
		console.log(movie);
	});
}

module.exports = { index, show };
