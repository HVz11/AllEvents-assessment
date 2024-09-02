"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const artistConroller_1 = require("../controllers/artistConroller");
const router = (0, express_1.Router)();
router.get("/search", artistConroller_1.getArtists);
exports.default = router;
