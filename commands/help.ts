import { commands } from '../src/config';
import { SubCommand } from '../src/subCommand';

export const help: SubCommand = async function(_argv, done) {
  console.log('Detected monorepo root path:', process.env.MONOREPO_ROOT);

  console.table(
    commands
      .sort((a, b) => a.command < b.command ? -1 : 1)
      .map(({ command, props }) => ({
        command,
        aliases: props.aliases?.join(),
        description: props.description,
        module: props.externalModule,
      })),
  );

  done();
};
