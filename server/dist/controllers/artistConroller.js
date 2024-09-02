"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtists = void 0;
const artistService_1 = require("../services/artistService");
const getArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Query parameter is required" });
        }
        const artists = yield (0, artistService_1.searchArtists)(q.toString());
        return res.json(artists);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.getArtists = getArtists;
