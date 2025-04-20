"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFiles = extractFiles;
function extractFiles(req) {
    const bufferArray = [];
    if (!req.files) {
        return false;
    }
    for (const file of req.files) {
        bufferArray.push(file.buffer);
    }
    return bufferArray;
}
