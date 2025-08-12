"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityController_1 = require("../controllers/activityController");
const validation_1 = require("../middleware/validation");
const activitySchemas_1 = require("../schemas/activitySchemas");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/trip/:tripId', (0, validation_1.validateParams)(activitySchemas_1.activitySchemas.getByTripId), activityController_1.activityController.getTripActivities);
router.post('/', (0, validation_1.validate)(activitySchemas_1.activitySchemas.createActivity), activityController_1.activityController.createActivity);
router.get('/:id', (0, validation_1.validateParams)(activitySchemas_1.activitySchemas.getById), activityController_1.activityController.getActivityById);
router.put('/:id', (0, validation_1.validateParams)(activitySchemas_1.activitySchemas.getById), (0, validation_1.validate)(activitySchemas_1.activitySchemas.updateActivity), activityController_1.activityController.updateActivity);
router.delete('/:id', (0, validation_1.validateParams)(activitySchemas_1.activitySchemas.getById), activityController_1.activityController.deleteActivity);
exports.default = router;
//# sourceMappingURL=activities.js.map