import { validateEmail } from '../../src/api/services/Validator';
import { describe, expect, it } from 'vitest';

describe('validateEmail function', () => {
    const validEmails = [
        'validemail@example.dk',
        'user.name+tag@domain.com',
        'email@sub.domain.co',
    ];

    const invalidEmails = [
        '',
        'plainaddress',
        '@missingusername.com',
        'missingdomain@.com',
        'missingatdomain.com',
        'email@.domain.com',
        'email@domain..com',
        'email@domain_com', // Underscore i domænet er ugyldigt
        'email@-domain.com', // Bindestreg som første tegn i domænet
    ];

    it('should return true for valid emails', () => {
        for (const email of validEmails) {
            const result = validateEmail(email);
            expect(result.isValid).toBe(true); // Kontrollerer, at isValid er true
        }
    });

    it('should return false for invalid emails', () => {
        for (const email of invalidEmails) {
            const result = validateEmail(email);
            expect(result.isValid).toBe(false); // Kontrollerer, at isValid er false
            expect(result.message).toBeDefined(); // Sikrer, at en fejlmeddelelse returneres
        }
    });

    it('should return appropriate error messages for invalid emails', () => {
        const invalidEmail = 'plainaddress';
        const result = validateEmail(invalidEmail);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('Invalid email format');
    });
});
