import { validatePassword } from '../../src/api/services/Validator';
import { describe, expect, it } from 'vitest';

describe('validatePassword function', () => {
    const validPasswords = ['Password123', 'Password1234', 'Password12345'];
    const invalidPasswords = ['password123', 'PASSWORD123','password', 'PASSWORD', '123456'];

    it('should return true for valid passwords', async () => {
        validPasswords.forEach(async (password) => {
            const result = await validatePassword(password);
            expect(result).toBe(true);
        });
    });

    it('should return false for invalid passwords', async () => {
        invalidPasswords.forEach(async (password) => {
            const result = await validatePassword(password);
            expect(result).toBe(false);
        });
    });

})