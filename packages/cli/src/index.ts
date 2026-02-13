#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .name('hive-beekit')
  .description('CLI helper for building Bluesky/OpenClaw bots that integrate with Hive')
  .version('0.1.0');

program
  .command('init')
  .description('Scaffold a new bot project')
  .action(() => {
    console.log('TODO: implement init flow');
  });

program
  .command('register')
  .description('Post Hive verification nonce and sync manifest')
  .action(() => {
    console.log('TODO: implement register flow');
  });

program.parse(process.argv);
