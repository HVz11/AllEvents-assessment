"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fuzzySearch = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const fuzzySearch = (query, artists) => {
    const options = {
        keys: ["name"],
        includeScore: true,
        threshold: 0.3, //For better Precision
        distance: 100,
        includeMatches: true,
        useExtendedSearch: true,
    };
    const fuse = new fuse_js_1.default(artists, options);
    const result = fuse.search(query);
    return result.map((res) => res.item);
};
exports.fuzzySearch = fuzzySearch;
