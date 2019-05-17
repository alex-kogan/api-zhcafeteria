
const getUserList = (res, db) => {
	const {User} = db.models
	User.find({},'_id fullName currentValue valueResetDate',(error, data) => {
		res.json(data)
	})
}

const addZero = (number) => {
	return number < 10 ? ('0' + number.toString()): number.toString()
}

const resetCurrentValues = (req, res, db) => {
	const errorMsg = 'The reset resulted in an error if this presists please contact admin, error details :'
	const {usersToReset} = req.body
	const {User, Transaction} = db.models
	User.find({_id: {$in: usersToReset}, currentValue: {$gt: 0}}, '_id currentValue', (error, users) => {
		if (error) {res.status(400).json(errorMsg + error)}
		// found the users we can insert the transaction
		else {
			// first create new transactions
			const newResetDate = new Date()
			const resetTransactions = []
			users.map((user) => {
				resetTransactions.push(new Transaction ({
					userID: user._id,
					transactionAmount: -user.currentValue,
					transactionDate: newResetDate.getFullYear()+'-'+addZero(newResetDate.getMonth()+1)+'-'+addZero(newResetDate.getDate()),
					transactionTime: addZero(newResetDate.getHours()) + ':' + addZero(newResetDate.getMinutes())
				}))
			})
			Transaction.insertMany(resetTransactions, (error, newTransactionsIds) => {
				if (error) {res.status(400).json(errorMsg + error)}
				else {
					User.updateMany({_id: {$in: usersToReset}},{$set: {valueResetDate: newResetDate, currentValue: 0}}, (error, resetUsers) => {
						if (error) {
							// remove the transactions
							Transaction.remove({_id: {$in: newTransactionsIds}},()=>{res.status(400).json(errorMsg + error)})
						}
						else {
							// transactions insert was good and upadtes were successful so return the new data
							User.find({},'_id fullName currentValue valueResetDate',(error, data) => {
								res.json(data)
							})
						}
					})
				}
			})
		}
	})
}

const handleAdminActions = (req, res, db) => {
	const {action} = req.body
	switch (action) {
		case 'getUsers':
			getUserList(res,db)
			return null;
		case 'resetValues':
			resetCurrentValues(req, res, db)
			return null;
		default:
			return null;
	}
}

module.exports = {
	handleAdminActions: handleAdminActions
}