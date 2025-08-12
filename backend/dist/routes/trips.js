"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = require("../controllers/tripController");
const validation_1 = require("../middleware/validation");
const tripSchemas_1 = require("../schemas/tripSchemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', tripController_1.tripController.getUserTrips);
router.post('/', (0, validation_1.validate)(tripSchemas_1.tripSchemas.createTrip), tripController_1.tripController.createTrip);
router.get('/:id', (0, validation_1.validateParams)(tripSchemas_1.tripSchemas.getTripById), tripController_1.tripController.getTripById);
router.put('/:id', (0, validation_1.validateParams)(tripSchemas_1.tripSchemas.getTripById), (0, validation_1.validate)(tripSchemas_1.tripSchemas.updateTrip), tripController_1.tripController.updateTrip);
router.delete('/:id', (0, validation_1.validateParams)(tripSchemas_1.tripSchemas.getTripById), tripController_1.tripController.deleteTrip);
router.get('/public/search', (0, validation_1.validateQuery)(tripSchemas_1.tripSchemas.exploreTrips), tripController_1.tripController.searchPublicTrips);
exports.default = router;
//# sourceMappingURL=trips.js.map