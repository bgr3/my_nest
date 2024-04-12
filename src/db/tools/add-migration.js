const execSync = require('child_process').execSync;

const arg = process.argv[2];
if (!arg) throw new Error('Pass name for migration');
const command = `typeorm-ts-node-commonjs migration:generate ./src/db/migrations/${arg} -d ./src/db/data-source.ts`;
execSync(command, {stdio: 'inherit'})