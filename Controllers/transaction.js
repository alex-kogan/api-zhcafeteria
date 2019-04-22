const roundedNumber = (number) => {
	return Math.round(number * 100) / 100	
}

const errorMsg = 'The transaction resultend in an error if this presists please contact admin '

const handleTransaction = (req, res, db) => {
	const {id} = req.params;
	const {amount} = req.body
	const {User, Transaction} = db.models
	User.findById(id, (error, user) => {
		if (error) {res.status(400).json(errorMsg + error)}
		// found the user we can insert the transaction
		else {
			// first create a new transaction
			const transaction = new Transaction ({
				userID: id,
				transactionAmount: amount,
				transactionDate: Date.now()
			})
			// save the transaction
			transaction.save((error, data) => {
				if (error) {res.status(400).json(errorMsg + error)}
				// saving function went well now need to update the user total amount
				else {
					user.currentValue = roundedNumber(user.currentValue + amount)
					user.save((error, user) => {
						if (error) {
							// remove the transaction
							Transaction.findOneAndRemove({_id: data._id},()=>{res.status(400).json(errorMsg + error)})
						}
						else {res.json(user)}
					})
				}
			}) 
		}
	})
}

module.exports = {
	handleTransaction: handleTransaction
}