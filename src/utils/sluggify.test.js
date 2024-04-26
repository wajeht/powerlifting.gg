import { sluggify } from './sluggify.js';
import { it, expect, describe } from 'vitest';

describe('sluggify', () => {
	it('should sluggify a string correctly', () => {
		expect(sluggify('Hello World')).toBe('hello-world');
		expect(sluggify('This is a Test'), 'this-is-a-test');
		expect(sluggify('12345'), '12345');
		expect(sluggify('Special_Characters!@#$'), 'special-characters');
	});

	it('should remove leading and trailing hyphens', () => {
		expect(sluggify('-Hello-World-')).toBe('hello-world');
		expect(sluggify('---This-is-a-Test---')).toBe('this-is-a-test');
		expect(sluggify('-----12345----')).toBe('12345');
	});

	it('should handle empty strings and edge cases', () => {
		expect(sluggify('')).toBe('');
		expect(sluggify('   ')).toBe('');
		expect(sluggify('-----')).toBe('');
	});

	it('should handle special characters', () => {
		expect(sluggify('!@#$%^&*()')).toBe('');
		expect(sluggify('---!@#$%^&*()')).toBe('');
	});
});
