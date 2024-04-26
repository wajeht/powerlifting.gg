import { it, expect, describe } from 'vitest';
import { nl2br } from './web.util.js';

describe('nl2br', () => {
	it('replaces newlines with <br>', () => {
		const input = 'Hello\nWorld';
		const expected = 'Hello<br>World';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});

	it('replaces carriage return + newline with <br>', () => {
		const input = 'Hello\r\nWorld';
		const expected = 'Hello<br>World';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});

	it('replaces carriage return with <br>', () => {
		const input = 'Hello\rWorld';
		const expected = 'Hello<br>World';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});

	it('replaces tab with non-breaking spaces', () => {
		const input = 'Hello\tWorld';
		const expected = 'Hello&nbsp;&nbsp;&nbsp;&nbsp;World';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});

	it('replaces spaces with non-breaking spaces', () => {
		const input = 'Hello  World'; // Two spaces between words
		const expected = 'Hello&nbsp;&nbsp;World';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});

	it('handles mixed newline types', () => {
		const input = 'Line1\nLine2\r\nLine3\rLine4';
		const expected = 'Line1<br>Line2<br>Line3<br>Line4';
		const result = nl2br(input);
		expect(result).toBe(expected);
	});
});
