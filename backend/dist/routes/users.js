"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const userSchemas_1 = require("../schemas/userSchemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/profile', auth_1.authenticateToken, userController_1.userController.getProfile);
router.put('/profile', auth_1.authenticateToken, (0, validation_1.validate)(userSchemas_1.userSchemas.updateProfile), userController_1.userController.updateProfile);
router.get('/:id', (0, validation_1.validateParams)(userSchemas_1.userSchemas.getUserById), userController_1.userController.getUserById);
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['ADMIN']), userController_1.userController.getAllUsers);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['ADMIN']), (0, validation_1.validateParams)(userSchemas_1.userSchemas.getUserById), userController_1.userController.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map