function errorsHandler(err, req, res, next) {
	res.status(err.code ?? 500);
	res.json({
		status: "error",
		error: err.message,
	});
}
module.exports = errorsHandler;
