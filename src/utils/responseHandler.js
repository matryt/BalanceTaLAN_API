"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalServerErrorResponse = exports.badRequestResponse = exports.createdResponse = exports.okResponseWithData = exports.okPhotoResponse = void 0;
const okPhotoResponse = (res, photo) => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', photo.length || 0);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.status(200).send(photo);
};
exports.okPhotoResponse = okPhotoResponse;
const okResponseWithData = (res, data) => {
    res.status(200).json(data);
};
exports.okResponseWithData = okResponseWithData;
const createdResponse = (res) => {
    const response = {
        success: true,
        message: 'Created',
        data: null,
    };
    res.status(201).json(response);
};
exports.createdResponse = createdResponse;
const badRequestResponse = (res, message, completeResponse = false) => {
    let response;
    if (completeResponse) {
        response = {
            success: false,
            message: message,
            data: null,
        };
    }
    else {
        response = [];
        console.error(message);
    }
    res.status(400).json(response);
};
exports.badRequestResponse = badRequestResponse;
const internalServerErrorResponse = (res, message) => {
    const response = {
        success: false,
        message: message,
        data: null,
    };
    res.status(500).json(response);
};
exports.internalServerErrorResponse = internalServerErrorResponse;
