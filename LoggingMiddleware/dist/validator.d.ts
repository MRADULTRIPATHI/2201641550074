import { Stack, Level, Package } from './types';
/**
 * Validates if the stack value is valid
 */
export declare function isValidStack(stack: string): stack is Stack;
/**
 * Validates if the level value is valid
 */
export declare function isValidLevel(level: string): level is Level;
/**
 * Validates if the package value is valid
 */
export declare function isValidPackage(pkg: string): pkg is Package;
/**
 * Validates if the package is compatible with the given stack
 */
export declare function isPackageCompatibleWithStack(stack: Stack, pkg: Package): boolean;
/**
 * Validates the entire log entry
 */
export declare function validateLogEntry(stack: string, level: string, pkg: string, message: string): {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=validator.d.ts.map