"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityController_1 = require("../controllers/cityController");
const validation_1 = require("../middleware/validation");
const citySchemas_1 = require("../schemas/citySchemas");
const router = (0, express_1.Router)();
router.get('/', (0, validation_1.validateQuery)(citySchemas_1.citySchemas.getAllCities), cityController_1.cityController.getAllCities);
router.get('/:id', (0, validation_1.validateParams)(citySchemas_1.citySchemas.getCityById), cityController_1.cityController.getCityById);
exports.default = router;
//# sourceMappingURL=cities.js.map