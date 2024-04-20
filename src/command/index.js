#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
	.name('powerlifting.gg')
	.description('multitenancy coaching review systems')
	.version('0.0.1');

if (process.argv.length < 3) {
	console.log('POWERLIFTING.GG');
	program.help();
}

program.parse(process.argv);
