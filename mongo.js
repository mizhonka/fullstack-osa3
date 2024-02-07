const mongoose = require('mongoose')

const password=process.argv[2]
const url=`mongodb+srv://mirandahonkanen:${password}@cluster0.7y7vox3.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema=mongoose.Schema({
    name: String,
    number: String
})
const Person=mongoose.model('Person', personSchema)

if(process.argv.length<=3){
    console.log('phonebook:')
    Person.find({}).then(result=>{
        result.forEach(person=>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
else{
    const newPerson=new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then(result => {mongoose.connection.close()})
}



