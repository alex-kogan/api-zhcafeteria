const handleStats = (req, res, db) => {
	const {id} = req.params;
	const {Transaction} = db.models
	const errorMsg = "There was an error retriving transactions data error presists please contact admin "
	Transaction.find({'userID': id}, (error, data) => {
		if (error) {res.status(400).json(errorMsg+error)}
		else {
			res.json(data)
		}
	})
}

module.exports = {
	handleStats: handleStats
}