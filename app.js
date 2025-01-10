//! CONIFIG EXPRESS
const express = require("express");
const app = express();
const port = 3000;

//! REGISTERING MIDDLEWARES
const errorsHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

//! configurazione per visualizzare i dati
app.use(express.static("public"));
app.use(express.json());

//! REGISTERING ROUTES
const moviesRouter = require("./routers/movies");
app.use("/movies", moviesRouter);

//! MIDDLEWARE ERROR
app.use(errorsHandler);
app.use(notFound);

//! START LISTENIG
app.listen(port, () => {
	console.log("App listening on port 3000");
});
