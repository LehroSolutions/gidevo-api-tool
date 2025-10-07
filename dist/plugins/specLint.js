"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../core/validator");
const chalk_1 = __importDefault(require("chalk"));
class SpecLintPlugin {
    constructor() {
        this.name = 'SpecLint';
    }
    initialize() {
        // Plugin initialization logic if needed
    }
    async run(specPath) {
        console.log(chalk_1.default.blue(`SpecLint: validating ${specPath}`));
        const validator = new validator_1.Validator();
        const result = await validator.validate(specPath);
        if (!result.valid) {
            console.log(chalk_1.default.red('🛑 SpecLint found issues:'));
            result.errors.forEach(error => console.log(chalk_1.default.red(` - ${error}`)));
        }
        else {
            console.log(chalk_1.default.green('✅ SpecLint: no issues found.'));
        }
        return true;
    }
}
exports.default = SpecLintPlugin;
//# sourceMappingURL=specLint.js.map