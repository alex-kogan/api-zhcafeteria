const handleProfile = (req, res, db) => {
	const {id} = req.params;
	const {User} = db.models
	User.findById(id, (error, data) => {
		if (error) {res.status(400).json("There was an error signing in if the error presists please contact admin "+error)}
		else if (data === null) {res.status(400).json("User does not exsit in system")}
		else {
			res.json(data)
		}
	})
}

module.exports = {
	handleProfile: handleProfile
}