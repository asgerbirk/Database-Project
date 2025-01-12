import { validateEmail } from '../../src/api/services/Validator';
import { describe, expect, it } from 'vitest';

describe('validateEmail function', () => {
    const validEmails = [
        'validemail@example.dk',
        'user.name+tag@domain.com',
        'email@sub.domain.co',
    ];

    const invalidEmails = [
        '', // Empty string
        'plainaddress', // Missing @ and domain
        '@missingusername.com', // Missing username
        'missingdomain@.com', // Missing domain
        'missingatdomain.com', // Missing @
        'email@.domain.com', // dot after @ 
        'email@domain..com', // Double dots
        'email@domain_com', // Underscore in domain & no dot
        'email@-domain.com',  // Hyphen in domain
    ];

    it('should return true for valid emails', () => {
        for (const email of validEmails) {
            const result = validateEmail(email);
            expect(result.isValid).toBe(true); 
        }
    });

    it('should return false for invalid emails', () => {
        for (const email of invalidEmails) {
            const result = validateEmail(email);
            expect(result.isValid).toBe(false); 
            expect(result.message).toBeDefined(); 
        }
    });

    it('should return appropriate error messages for invalid emails', () => {
        const invalidEmail = 'plainaddress';
        const result = validateEmail(invalidEmail);
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('Invalid email format');
    });
});
