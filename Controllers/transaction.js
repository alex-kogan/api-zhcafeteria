const roundedNumber = (number) => {
	return Math.round(number * 100) / 100	
}

const handleTransaction = (req, res, db) => {
	const {id} = req.params;
	const {amount} = req.body
	const {User} = db.models
	User.findById(id, (error, user) => {
		if (error) {res.status(400).json("The transcation resultend in an error presists please contact admin "+error)}
		else {
			user.currentValue = roundedNumber(user.currentValue + amount)
			user.save((error, user) => {
				if (error) {res.status(400).json("The transcation resultend in an error presists please contact admin "+error)}
				else {res.json(user)}
			}) 
		}
	})
}

module.exports = {
	handleTransaction: handleTransaction
}