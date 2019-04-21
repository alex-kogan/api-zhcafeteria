const handleAdminUserList = (req, res, db) => {
	const {User} = db.models
	User.find({},'_id fullName currentValue valueResetDate',(error, data) => {
		res.json(data)
	})
}

module.exports = {
	handleAdminUserList: handleAdminUserList
}