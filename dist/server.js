"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const PORT = 8000;
// middlewares
app.use((0, morgan_1.default)("combined"));
// start the server
app.listen(PORT, () => {
    console.log(`Server running a ${PORT}`);
});
