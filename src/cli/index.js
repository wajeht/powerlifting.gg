#!/usr/bin/env node

import { Command } from 'commander';
import { clear } from './clear.command.js';
import { restore } from './restore.command.js';
import { backup } from './backup.command.js';

const program = new Command();

program
	.name('powerlifting.gg')
	.description('multitenancy coaching review systems')
	.version('0.0.1');

program
	.command('clear')
	.description('clear some stuff')
	.option('-cc, --cloudflare-cache', 'clear cloudflare cache')
	.option('-rc, --redis-cache', 'clear redis cache')
	.option('-a, --all-cache', 'clear all cache')
	.action(async (option) => await clear(option));

program
	.command('restore')
	.description('restore database')
	.action(async (option) => await restore(option));

program
	.command('backup')
	.description('backup database')
	.action(async (option) => await backup(option));

if (process.argv.length < 3) {
	console.log('POWERLIFTING.GG');
	program.help();
}

program.parse(process.argv);
