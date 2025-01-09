import { validateEmail } from '../../src/api/services/Validator';
import { describe, expect, it } from 'vitest';

describe('validateEmail function', () => {
    const validEmails = ['validemail@example.dk'];
    const invalidEmails = ['invalidemail', 'invalidemail@', 'invalidemail@.dk', 'invalidemail@dk', 'invalidemail.dk'];

    it('should return true for valid emails', async () => {
        validEmails.forEach(async (email) => {
            const result = await validateEmail(email);
            expect(result).toBe(true);
        });
    });

    it('should return false for invalid emails', async () => {
        invalidEmails.forEach(async (email) => {
            const result = await validateEmail(email);
            expect(result).toBe(false);
        });
    });

});