const handleSignin = (req, res, db, bcrypt) => {
	const {User, Password} = db.models
	const {password} = req.body
	const email = req.body.email.toLowerCase();
	Password.findOne({email: email},(error, user) => {
		if (error) {res.status(400).json("There was an error signing in if the error presists please contact admin "+error)}
		else if (user === null) {res.status(400).json("Email does not exsit in system")}
		else {
			bcrypt.compare(password, user.password, (error, passwordValid) => {
				if (passwordValid) {
					User.findOne({email: email},(error, data) => {
						res.json(data)
					})
				}
				else {res.status(400).json("Wrong password for this user")}
			})
		}
	})
}

module.exports = {
	handleSignin: handleSignin
}