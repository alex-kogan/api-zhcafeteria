
const getUserList = (res, db) => {
	const {User} = db.models
	User.find({},'_id fullName currentValue valueResetDate',(error, data) => {
		res.json(data)
	})
}

const handleAdminActions = (req, res, db) => {
	const {action} = req.body
	switch (action) {
		case 'getUsers':
			getUserList(res,db)
	}
}

module.exports = {
	handleAdminActions: handleAdminActions
}