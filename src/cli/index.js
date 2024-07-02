#!/usr/bin/env node

import { Command } from 'commander';
import { clear } from './clear.command.js';

const program = new Command();

program
	.name('powerlifting.gg')
	.description('multitenancy coaching review systems')
	.version('0.0.1');

program
	.command('clear')
	.description('clear some stuff')
	.option('-cc, --cloudflare_cache', 'clear cloudflare cache')
	.option('-rc, --redis_cache', 'clear redis cache')
	.option('-a, --all_cache', 'clear all cache')
	.action(async (option) => await clear(option));

if (process.argv.length < 3) {
	console.log('POWERLIFTING.GG');
	program.help();
}

program.parse(process.argv);
