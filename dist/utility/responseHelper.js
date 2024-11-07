"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildErrorRespone = exports.buildSuccessRespone = void 0;
const buildSuccessRespone = (res, data, message) => {
    res.json({
        status: "success",
        data,
        message,
    });
};
exports.buildSuccessRespone = buildSuccessRespone;
const buildErrorRespone = (res, message) => {
    res.json({
        status: "error",
        message: message || "Something went wrong",
    });
};
exports.buildErrorRespone = buildErrorRespone;
