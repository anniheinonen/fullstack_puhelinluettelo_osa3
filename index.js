const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.static('build'))
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*let persons = [
    
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    }
      
]*/


app.get('/info', (req, res) => {
  res.send(
      '<p>Phonebook has info for ' + persons.length + ' people</p>' + new Date
      )
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response) => {
    //const id = Number(request.params.id)
    //const person = persons.find(person => person.id === id)

    Person.findById(request.params.id).then(person => {
        response.json(person)
    })

    /*if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }*/
})

/*app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})*/

const generateId = () => {
    const randId = Math.floor(Math.random() * Math.floor(1000))
    return randId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name missing' 
      })
    }
    
    if(!body.number) {
        return response.status(400).json({ 
            error: 'Number missing' 
        }) 
    }

   /* if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'Name must be unique.' 
        }) 
    } */

  
    const person = new Person({
      name: body.name,
      number: body.number,
      date: new Date(),
      id: generateId(),
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
