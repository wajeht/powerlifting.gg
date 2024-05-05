import { it, expect, describe } from 'vitest';
import { nl2br, extractDomainName } from './web.util.js';

describe.concurrent('nl2br', () => {
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

describe.concurrent('extractDomainName', () => {
	it('extracts domain name from URL with https', () => {
		const input = 'https://powerlifting.gg';
		const expected = 'powerlifting';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL with www', () => {
		const input = 'www.powerlifting.gg';
		const expected = 'powerlifting';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL without www or https', () => {
		const input = 'powerlifting.gg';
		const expected = 'powerlifting';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL with subdomain', () => {
		const input = 'https://subdomain.powerlifting.gg';
		const expected = 'subdomain';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL with multiple subdomains', () => {
		const input = 'https://sub1.sub2.powerlifting.gg';
		const expected = 'sub1';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL with path', () => {
		const input = 'https://powerlifting.gg/path/to/page';
		const expected = 'powerlifting';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});

	it('extracts domain name from URL with query parameters', () => {
		const input = 'https://powerlifting.gg/page?param=value';
		const expected = 'powerlifting';
		const result = extractDomainName(input);
		expect(result).toBe(expected);
	});
});
