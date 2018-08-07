"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(5000, () => {
    console.log('Listening on port 5000: http://localhost:5000');
});
//# sourceMappingURL=index.js.map