//connetto Database e Express
const connection = require("../db/connection");

//funzione index
function index(req, res) {
	//imposto la query
	const sql = "SELECT * FROM `movies`";

	connection.query(sql, (err, results) => {
		//eseguo la query
		if (err) return res.status(500).json({ error: "Database query failed" });
		res.json(results);
		console.log(results);
	});
}
//funzione show

module.exports = { index };
