//connetto Database e Express
const { connected } = require("process");
const connection = require("../db/connection");
const { ok } = require("assert");

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
	//recupero id del film
	const movieId = req.params.id;
	//imposto la query
	const moviesSql = `
    SELECT id, title, director, genre, release_year, abstract 
    FROM movies 
    WHERE id = ?;
    `;
	//eseguo la query
	connection.query(moviesSql, [movieId], (err, results) => {
		//imposto messaggi di errore
		if (err) {
			console.log(err);
			return res.status(500).json({
				status: "Error",
				message: "Database query failed",
			});
		}
		//visualizzo il film cercato
		const [movie] = results;

		if (!results) {
			return res.status(404).json({
				status: "Error",
				message: "Movie not found",
			});
		}

		//imposto la query per collegare le recensioni
		const reviewsSql = `
        SELECT reviews.id AS id_recensione, reviews.name, reviews.vote, reviews.text
        FROM reviews
        INNER JOIN movies
        ON reviews.movie_id = movies.id
        WHERE movie_id = ?
        ;
        `;
		//eseguo la query
		connection.query(reviewsSql, [movieId], (err, results) => {
			//imposto messaggi di errore
			if (err) return res.status(500).json({ error: "Database query failed" });
			if (results.length === 0)
				return res.status(404).json({ error: "Review not found" });

			movie.reviews = results;

			res.json({
				status: "OK",
				movie,
			});
		});
	});
}

module.exports = { index, show };
