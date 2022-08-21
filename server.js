const express = require('express');
const noteData = require('./db/db.json')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');
 


const PORT = process.env.PORT || 5001 
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public')); // index.html


app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`)
})

//method: 'get' = READ data
app.get('/api/notes', (req, res) => { // get all notes
    res.json(noteData)
    
})

app.get('/api/notes/:id', (req, res) => { // get a note
    const requestedNote = noteData.find(note => note.noteID == req.params.id)
    console.log(requestedNote)
    if (requestedNote){
        console.log(`success`)
    }  
    res.json(requestedNote) 
})

//method: 'post' = CREATE data
app.post('/api/notes', (req, res) => { 
    console.log(req.body)
    const { title, text } = req.body 
    let id

    if (title && text){ 
        const newNote = {  
            title,
            text,
            noteID: uuidv4(id)
        }

        noteData.push(newNote)

        //write to disk
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err, data) => { //append to file?
            err ? console.log(err) : console.log(`success`)
        })

        const response = {
            status: 'success',
            body: newNote
        }

        console.log(response)
        res.json(response)
    }
})

app.delete(`/api/notes/:noteID`, (req, res) => { 
    const requestedNote = noteData.findIndex(note => note.noteID == req.params.noteID)
    console.log(requestedNote)

    if (requestedNote){
        noteData.splice(requestedNote,1);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err, data) => {
            err ? console.log(err) : console.log(`success`)
        });
        res.json(noteData);
    } else res.json({
        message: "Note not found"
    })
})

app.listen(PORT, () => {
    console.log(`Note Taker app is listening at http://localhost:${PORT}`)
})