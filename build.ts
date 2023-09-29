import { BuildOptions, buildSync } from 'esbuild';

const production = process.env.NODE_ENV === 'production';
const debug = Boolean(process.env.DEBUG);

const options: BuildOptions = {
  entryPoints: ['bin/aumi-cli.ts'],
  outdir: 'dist',
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  bundle: true,
  minify: production && !debug,
  define: {
    'process.env.DEV': debug ? '"true"' : '"false"',
    'process.env.NODE_ENV': debug ? '"dev"' : '"production"',
  },
};

console.log(
  `Building for ${production ? 'PRODUCTION' : 'DEV'} (DEBUG: ${debug ? 'on' : 'off'}) with following options:`,
);
console.log(options);

buildSync(options);

console.log(`Done! Output in '${options.outdir as string}'.`);
