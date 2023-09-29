import { commands, modules } from '../../src/config';
import { SubCommand } from '../../src/subCommand';
import { installCompletions } from './install';

export type Completion = (words: string[], current: number) => string[] | Promise<string[]>;

export interface Options {
  [key: string]: string | true;
}

const EXECUTABLE = 'aumi';

const parseOptions = (options: string[]): Options => {
  return options
    .join(' ')
    .split('--')
    .filter(Boolean)
    .map((option) => option.trim())
    .map((option) => option.split(/[= ]/))
    .reduce(
      (options, [optionName, ...optionValue]) => ({
        ...options,
        [optionName]: optionValue.length > 0 ? optionValue.join(' ') : true,
      }),
      {},
    );
};

function printCompletions(completions: string[]): void {
  console.log(completions.join(' '));
}

export const completer: SubCommand = async function(argv, done) {
  /**
     * Available environment variables for completion:
     *
     * COMP_LINE => whole line, includes binary: v launch assistant-
     * COMP_CWORD => index for current word
     * COMP_POINT => character index for whole string
     *
     */

  const binary = argv[1]?.endsWith('dev') ? `${EXECUTABLE}dev` : EXECUTABLE;
  const options = parseOptions(argv.slice(2));
  if (options.install !== undefined) {
    return installCompletions(options, done, binary);
  }

  const words = (process.env.COMP_LINE ?? '').split(' ').slice(1);
  const current = Math.max(0, parseInt(process.env.COMP_CWORD ?? '1') - 1);
  const activeCommand = words[0];

  // Show available commands
  if (current === 0 || activeCommand === undefined) {
    printCompletions(commands.map(({ command }) => command).sort((a, b) => a < b ? -1 : 1));
    return done();
  }

  // For subcommands delegate to configured function
  const module = modules.get(activeCommand);
  if (module?.props.completion !== undefined) {
    printCompletions(await module?.props.completion(words, current));
  }

  done();
};
