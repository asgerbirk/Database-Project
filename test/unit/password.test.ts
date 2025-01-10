import { validateZodPassword } from '../../src/api/services/Validator';
import { describe, expect, it } from 'vitest';

describe('validatePassword function', () => {
    const validPasswords = [
        'Password123.', 
        'Password1234!', 
        'Password12345/',
        'P@ssw0rdGood!',  // Tilføjet som ekstra test
    ];
    
    const invalidPasswords = [
        'password123',  // Ingen uppercase
        'PASSWORD123',  // Ingen lowercase
        'password',     // Ingen tal og ingen specialtegn
        'PASSWORD',     // Ingen lowercase, ingen tal, ingen specialtegn
        '123456',       // Ingen bogstaver eller specialtegn
        '',             // Tom streng
        'P@ss1',        // For kort
        'P@ssw0rdWayTooLong123!', // For lang
    ];

    it('should return true for valid passwords', () => {
        for (const password of validPasswords) {
            const result = validateZodPassword(password);
            expect(result.isValid).toBe(true); // Checker kun isValid
        }
    });

    it('should return false for invalid passwords', () => {
        for (const password of invalidPasswords) {
            const result = validateZodPassword(password);
            expect(result.isValid).toBe(false); // Checker kun isValid
            expect(result.message).toBeDefined(); // Fejlmeddelelse skal være der
        }
    });
});
