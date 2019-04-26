const handleRegister =  (req, res, db, bcrypt) => {
	const {User, Password} = db.models
	const {password} = req.body
	const email = req.body.email.toLowerCase();
	bcrypt.hash(password, null, null, (error, hashedPass) => {
		// create a new password instance with the hased password
		const passwordInstance = new Password({
			email: email,
			password: hashedPass
		})
		// save the password document in the password collection
		passwordInstance.save((error, data) => {
			// if there's an error handle error
			if (error) {
				// if the error is an already exsiting email
				if (error.code === 11000 || error.code === 11001) {
					res.status(400).json('Email already exists in the database')	
				}
				else {res.status(400).json('Error creating a user, please try again if problem presists please reach to system admin: '+error)}
			}
			// if there's no error continue and save a user
			else {
				const user = new User({
					admin: false,
					email: data.email,
					currentValue: 0,
					valueResetDate: Date.now()
				});
				user.save((error, data) => {
					if (error) {
						// if there was an error saving a new user remove the instance from the password collection
						Password.findOneAndRemove({email: email},()=>{res.status(400).json('Error creating a user, please try again if problem presists please reach to system admin: '+error)})
					} 
					else {
						// if user created succesfuly respond all the user's data
						res.json(data)
					}
				})
			}
		})
	})
}

module.exports = {
	handleRegister: handleRegister
}
