const crypto = require("crypto");

let notes = {};

exports.createNote = (content) => {
    const noteId = crypto.randomBytes(64).toString("hex");
    const token = crypto.randomBytes(64).toString("hex");
    const creationTime = Date.now();
    notes[noteId] = { content, token, creationTime };
    return { noteId, token };
}

exports.getNote = (noteId) => {
    if (!notes[noteId]) return null;
    const note = notes[noteId];
    return note;
}

exports.getNoteByToken = (token) => {
    for (const noteId in notes) {
        if (notes[noteId]['token'] === token) {
            return { noteId, content: notes[noteId]['content'] };
        }
    }
    return null;
}

exports.updateNote = (noteId, content) => {
    notes[noteId]['content'] = content;
}

exports.cleanNotes = () => {
    const now = Date.now();
    for (const noteId in notes) {
        if (now - notes[noteId]['creationTime'] > 60000 * 5) {
            delete notes[noteId];
        }
    }
}
