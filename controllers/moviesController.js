//connetto Database e Express
const { connected } = require("process");
const connection = require("../db/connection");

//funzione per completare path immagini
/**
 * funzione che genera il path assoluto dell'immagine a partire dal nome
 */
const generatePathImg = (imageName) => {
	return "http://localhost:3000/movies_cover/" + imageName;
};

//funzione index
/**
 * funzione che mostra la lista dei film
 */
function index(req, res) {
	//imposto la query
	const sql = "SELECT * FROM `movies`";
	//eseguo la query
	connection.query(sql, (err, results) => {
		if (err) return res.status(500).json({ error: "Database query failed" });
		const movies = results.map((movie) => ({
			...movie,
			image: generatePathImg(movie.image),
		}));
		console.log(movies);
		res.json({
			status: "OK",
			movies,
		});
	});
}

//funzione show
/**
 * funzione che mostra il dettaglio di un film
 */
function show(req, res) {
	//recupero id del film
	const movieId = req.params.id;
	//imposto la query
	const moviesSql = `
    SELECT id, title, director, genre, release_year, abstract, image
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
		movie.image = generatePathImg(movie.image);
		console.log(movie.image);

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

//funzione store nuova recensione
/**
 * funzione che crea una nuova recensione dato l'id del film
 */
function createNewReview(req, res) {
	//recupero id del film
	const movieId = req.params.id;
	const [name, text, vote] = req.body;
	//imposto la query
	const reviewSql = `
    INSERT INTO reviews (name, text, vote, bookId) VALUES (?, ?, ?, ?);
    `;
	//eseguo la query
	connection.query(reviewSql, [name, text, vote, bookId], (err) => {
		//imposto messaggi di errore
		if (err) {
			console.log(err);
			return res.status(500).json({
				status: "Error",
				message: "Database query failed",
			});
		}
		res.json({
			status: "OK",
			message: "Review created successfully",
		});
	});
}
module.exports = { index, show, createNewReview };
