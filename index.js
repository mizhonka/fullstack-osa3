const express = require('express')
const app = express()

app.use(express.json())

let notes=[
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/api/persons', (request, response)=>{
    response.json(notes)
})

app.get('/info', (request, response)=>{
    const amount=notes.length
    const d=new Date()
    response.send(`<p>Phonebook has ${amount} people</p><p>${d.toUTCString()}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id =request.params.id
    const person=notes.find(note=>note.id===parseInt(id))
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

const generateId=()=>{return Math.floor(Math.random()*100)}

app.post('/api/persons', (request, response) =>{
    const body=request.body
    if(!body.name && !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person={
        id: generateId(),
        name: body.name,
        number: body.number
    }
    notes=notes.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id =request.params.id
    notes=notes.filter(note=>note.id===parseInt(id))
    response.status(204).end()
})

const port=3001
app.listen(port)
