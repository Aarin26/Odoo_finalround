"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const authSchemas_1 = require("../schemas/authSchemas");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_1.validate)(authSchemas_1.authSchemas.register), authController_1.authController.register);
router.post('/login', (0, validation_1.validate)(authSchemas_1.authSchemas.login), authController_1.authController.login);
router.post('/refresh', (0, validation_1.validate)(authSchemas_1.authSchemas.refreshToken), authController_1.authController.refreshToken);
exports.default = router;
//# sourceMappingURL=auth.js.map