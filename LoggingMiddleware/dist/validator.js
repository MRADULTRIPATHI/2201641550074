"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidStack = isValidStack;
exports.isValidLevel = isValidLevel;
exports.isValidPackage = isValidPackage;
exports.isPackageCompatibleWithStack = isPackageCompatibleWithStack;
exports.validateLogEntry = validateLogEntry;
/**
 * Valid values for each log parameter
 */
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
// Backend-only packages
const BACKEND_PACKAGES = [
    'cache', 'controller', 'cron_job', 'db', 'domain',
    'handler', 'repository', 'route', 'service'
];
// Frontend-only packages
const FRONTEND_PACKAGES = [
    'api', 'component', 'hook', 'page', 'state', 'style'
];
// Shared packages (can be used by both backend and frontend)
const SHARED_PACKAGES = ['auth', 'config', 'middleware'];
const ALL_PACKAGES = [...BACKEND_PACKAGES, ...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
/**
 * Validates if the stack value is valid
 */
function isValidStack(stack) {
    return VALID_STACKS.includes(stack);
}
/**
 * Validates if the level value is valid
 */
function isValidLevel(level) {
    return VALID_LEVELS.includes(level);
}
/**
 * Validates if the package value is valid
 */
function isValidPackage(pkg) {
    return ALL_PACKAGES.includes(pkg);
}
/**
 * Validates if the package is compatible with the given stack
 */
function isPackageCompatibleWithStack(stack, pkg) {
    if (SHARED_PACKAGES.includes(pkg)) {
        return true; // Shared packages can be used by both stacks
    }
    if (stack === 'backend' && BACKEND_PACKAGES.includes(pkg)) {
        return true;
    }
    if (stack === 'frontend' && FRONTEND_PACKAGES.includes(pkg)) {
        return true;
    }
    return false;
}
/**
 * Validates the entire log entry
 */
function validateLogEntry(stack, level, pkg, message) {
    const errors = [];
    if (!stack || typeof stack !== 'string') {
        errors.push('Stack is required and must be a string');
    }
    else if (!isValidStack(stack)) {
        errors.push(`Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')}`);
    }
    if (!level || typeof level !== 'string') {
        errors.push('Level is required and must be a string');
    }
    else if (!isValidLevel(level)) {
        errors.push(`Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
    }
    if (!pkg || typeof pkg !== 'string') {
        errors.push('Package is required and must be a string');
    }
    else if (!isValidPackage(pkg)) {
        errors.push(`Invalid package: ${pkg}. Must be one of: ${ALL_PACKAGES.join(', ')}`);
    }
    if (!message || typeof message !== 'string') {
        errors.push('Message is required and must be a string');
    }
    else if (message.trim().length === 0) {
        errors.push('Message cannot be empty');
    }
    // Cross-validation: check if package is compatible with stack
    if (isValidStack(stack) && isValidPackage(pkg) && !isPackageCompatibleWithStack(stack, pkg)) {
        if (stack === 'backend') {
            errors.push(`Package '${pkg}' cannot be used with 'backend' stack. Use backend packages: ${BACKEND_PACKAGES.join(', ')} or shared packages: ${SHARED_PACKAGES.join(', ')}`);
        }
        else {
            errors.push(`Package '${pkg}' cannot be used with 'frontend' stack. Use frontend packages: ${FRONTEND_PACKAGES.join(', ')} or shared packages: ${SHARED_PACKAGES.join(', ')}`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
//# sourceMappingURL=validator.js.map