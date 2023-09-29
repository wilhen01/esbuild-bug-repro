import { banner, completion, find, help, launch, list } from '../commands';
import * as completions from '../completions';
import { CommandDetails } from './CommandDetails';
import { getMonorepoRoot } from './helpers';

interface Dict<T> {
  [key: string]: T | undefined;
}

export const commands: CommandDetails[] = [
  new CommandDetails('launch', launch, {
    tagline: 'Open packages in VSCode 🚀',
    exampleUsage: 'launch aws-login aumi-cli',
    completion: completions.launch,
  }),

  new CommandDetails('find', find, {
    aliases: ['search'],
    tagline: 'Find packages in the monorepo!',
    exampleUsage: 'find codebuild-images',
    completion: completions.find,
  }),

  new CommandDetails('list', list, {
    aliases: ['ls'],
    tagline: 'One command to see them all!',
    exampleUsage: 'list',
  }),

  new CommandDetails('about', banner, {
    description: 'About Aumi Banner',
  }),

  new CommandDetails('help', help, {
    description: 'How to use this CLI',
  }),

  new CommandDetails('completion', completion, {
    hidden: true,
    description: 'Code completion helper',
  }),
];

export const modules: Map<string, CommandDetails> = commands
  .reduce((dict, command) =>
    [command.command, ...command.props.aliases ?? []]
      .reduce((dict, alias) => dict.set(alias, command), dict), new Map());

export const ENV: Dict<string> = {
  MONOREPO_ROOT: getMonorepoRoot(),
};
