const express = require("express");
const router = express.Router();
const { doubleCsrf } = require("csrf-csrf");

const { createNote, getNote, getNoteByToken, updateNote } = require("../data");
const { getCsrfSecret } = require("../utils");
const { visit } = require("../bot");

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: getCsrfSecret,
    getTokenFromRequest: (req) => { return req.body.csrfToken },
    cookieName: "csrfToken",
    cookieOptions: {
        secure: false,
    },
});

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', (req, res) => {
    const note = req.body.note;
    const { noteId, token } = createNote(note);
    req.session.token = token;
    res.render('noteCreated', { noteId, token });
    if (!note.startsWith('Flag: ')) visit(noteId);
});

router.post('/login', (req, res) => {
    const token = req.body.token;
    const note = getNoteByToken(token);
    if (note) {
        req.session.token = token;
        res.redirect(`/notes/${note['noteId']}`);
    } else {
        res.status(400).send('Invalid token');
    }
});

router.get('/notes/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    let note;
    let myNote;
    try {
        note = getNote(noteId)['content'];
        myNote = getNoteByToken(req.session.token);
    } catch (e) {
        res.status(404).send('Note not found');
        return;
    }
    const csrfToken = generateToken(res);
    res.render('note', { noteId, note, myNote, csrfToken });
});

router.post('/notes/:noteId', doubleCsrfProtection, (req, res) => {
    const noteId = req.params.noteId;
    if (req.session.token !== getNote(noteId)['token']) {
        res.status(403).send('Unauthorized');
    } else {
        const note = req.body.note;
        updateNote(noteId, note);
        res.redirect(`/notes/${noteId}`);
    }
});

module.exports = router;
