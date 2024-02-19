const mongoose = require('mongoose')

const url=process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema=mongoose.Schema({
	name: {
		type: String,
		minlength: 3
	},
	number: {
		type: String,
		minlength: 8,
		validator:{
			validate: (n) => {
				return /\d{2, 3}-\d+/.test(n)
			}
		}
	}
})
personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id=returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports=mongoose.model('Person', personSchema)

