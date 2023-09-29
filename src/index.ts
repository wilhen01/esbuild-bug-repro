import { render } from 'ink';
import { getComponent } from '../components/CLI';

export async function run(argv: string[]): Promise<void> {
  await render(getComponent(argv), {
    patchConsole: false,
  }).waitUntilExit();
}
