import { Completion } from '../commands';
import { pick, SubCommand } from './subCommand';

export interface CommandDetailsProps {
  description?: string;
  aliases?: string[];
  hidden?: boolean;
  externalModule?: string;
  tagline?: string;
  exampleUsage?: string;
  completion?: Completion;
}

interface ImportCommandDetailsProps extends CommandDetailsProps {
  pick?: string;
}

export class CommandDetails {
  public readonly command: string;
  public readonly executable: Promise<SubCommand>;
  public readonly props: CommandDetailsProps;

  public constructor(command: string, executable: SubCommand | Promise<SubCommand>, props: CommandDetailsProps = {}) {
    this.command = command;
    this.executable = Promise.resolve(executable);

    const defaultProps: CommandDetailsProps = {
      aliases: [],
      hidden: false,
    };

    this.props = {
      ...defaultProps,
      ...props,
    };
  }

  public static fromImport(command: string, module: any, props: ImportCommandDetailsProps = {}): CommandDetails {
    return new CommandDetails(command, module.then(pick(props.pick)), props);
  }
}
