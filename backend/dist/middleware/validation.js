"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                error: {
                    message: error.details[0].message
                }
            });
            return;
        }
        next();
    };
};
exports.validate = validate;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            res.status(400).json({
                error: {
                    message: error.details[0].message
                }
            });
            return;
        }
        next();
    };
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({
                error: {
                    message: error.details[0].message
                }
            });
            return;
        }
        next();
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.js.map