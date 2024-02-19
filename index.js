require('dotenv').config()
const express = require('express')
const cors=require('cors')
const morgan = require('morgan')
const app = express()
const Person=require('./models/person')

morgan.token('data', (req) => {JSON.stringify(req.body)})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const errorHandler=(error, request, response, next) => {
	if(error==='CastError'){
		return response.status(400).send({ error: 'malformatted id' })
	}
	if(error==='Empty'){
		return response.status(400).send({ error: 'name or number cannot be empty' })
	}
	if(error==='ValidationError'){
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/info', (request, response) => {
	const d=new Date()
	Person.countDocuments().then(amount => {
		response.send(`<p>Phonebook has ${amount} people</p><p>${d.toUTCString()}</p>`)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	const id=request.params.id
	Person.findById(id).then(result => {
		response.json(result)
	})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body=request.body
	if(!body.number){
		return next('Empty')
	}

	const person=new Person({
		name: body.name,
		number: body.number
	})

	Person.findOneAndUpdate({ name: person.name }, { number: person.number }, { new:true }).then(updatedPerson => {
		response.json(updatedPerson)
	})
})

app.post('/api/persons', (request, response, next) => {
	const body=request.body
	if(!body.number){
		return next('Empty')
	}

	const person=new Person({
		name: body.name,
		number: body.number
	})
	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id).then(
		response.status(204).end()
	)
		.catch(error => next(error))
})

const port=process.env.PORT
app.listen(port)
app.use(errorHandler)
