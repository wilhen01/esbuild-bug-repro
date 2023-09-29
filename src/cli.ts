import { parseFromCommandLine } from './commandParser';
import { ENV, modules } from './config';
import { callSubCommand } from './subCommand';

export async function cli(
  argv: string[],
  done: (code?: number) => void,
): Promise<any> {
  const input = parseFromCommandLine(argv, ['command']);

  const {
    namedArgs: { command },
  } = input;

  const module = modules.get(command) ?? modules.get('help');

  if (module === undefined) {
    console.error('Error: Subcommand not found');
    return done(1);
  }

  process.env = { ...process.env, ...ENV };

  return await callSubCommand(module.executable, input, done);
}
