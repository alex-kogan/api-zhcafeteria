const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const captilizeName = (name) => {
  return name[0].toUpperCase() + name.slice(1)
}

const userSchema = new mongoose.Schema({
	admin: {
  	type: Boolean,
  	required: true
	},
	firstName: {type: String},
	lastName: {type: String},
  fullName: {type: String},
	email: {
		type: String,
  	required: true,
    unique: true
	},
	currentValue: {
  	type: Number,
  	required: true
	},
	valueResetDate: {
  	type: Date,
  	required: true
	}
});

userSchema.pre('save', function(next) {
  const doc = this;
  const email = this.email
  const numberDots = (email.match(/\./g) || []).length;
  let firstName = ''
  let lastName = ''
  let fullName = ''
  if (numberDots===2) {
    firstName =captilizeName(email.substring(0,email.indexOf('.')))
    lastName = captilizeName(email.substring(firstName.length+1,email.indexOf('@')))
    fullName = lastName+', '+firstName
  }
  else {
    firstName = captilizeName(email.substring(0,email.indexOf('@')))
    fullName = firstName
  }
  doc.firstName = firstName
  doc.lastName = lastName
  doc.fullName = fullName
  next()
});



module.exports = mongoose.model('User', userSchema)