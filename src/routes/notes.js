const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


// GET /api/notes -> list notes (with optional ?q=search)
router.get('/', async (req, res, next) => {
try {
const { q } = req.query;
const filter = q
? { $or: [ { title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') } ] }
: {};
const notes = await Note.find(filter).sort({ updatedAt: -1 });
res.json(notes);
} catch (err) {
next(err);
}
});


// GET /api/notes/:id -> single note
router.get('/:id', async (req, res, next) => {
try {
const note = await Note.findById(req.params.id);
if (!note) return res.status(404).json({ message: 'Note not found' });
res.json(note);
} catch (err) {
next(err);
}
});


// POST /api/notes -> create
router.post('/', async (req, res, next) => {
try {
const { title, content } = req.body;
if (!title) return res.status(400).json({ message: 'Title is required' });
const note = new Note({ title, content });
await note.save();
res.status(201).json(note);
} catch (err) {
next(err);
}
});


// PUT /api/notes/:id -> update
router.put('/:id', async (req, res, next) => {
try {
const { title, content } = req.body;
const note = await Note.findByIdAndUpdate(
req.params.id,
{ title, content },
{ new: true, runValidators: true }
);
if (!note) return res.status(404).json({ message: 'Note not found' });
res.json(note);
} catch (err) {
next(err);
}
});


// DELETE /api/notes/:id -> delete
router.delete('/:id', async (req, res, next) => {
try {
const note = await Note.findByIdAndDelete(req.params.id);
if (!note) return res.status(404).json({ message: 'Note not found' });
res.json({ message: 'Note deleted' });
} catch (err) {
next(err);
}
});


module.exports = router;