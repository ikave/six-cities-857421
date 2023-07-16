import { CLICommandInterface } from '../core/cli-command/cli-command.interface';

type ParsedCommand = {
  [key: string]: string[];
};

export default class CLIAplication {
  private commands: { [propertyName: string]: CLICommandInterface } = {};
  private defaultCommand = '--help';

  private parseCommand(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let command = '';

    return cliArguments.reduce((acc, item) => {
      if (item.startsWith('--')) {
        acc[item] = [];
        command = item;
      } else if (command && item) {
        acc[command].push(item);
      }

      return acc;
    }, parsedCommand);
  }

  public getCommand(commandName: string): CLICommandInterface {
    return this.commands[commandName] || this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = this.parseCommand(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] || [];
    command.execute(...commandArguments);
  }

  public registerCommands(commandsList: CLICommandInterface[]): void {
    commandsList.reduce((acc, command) => {
      acc[command.name] = command;
      return acc;
    }, this.commands);
  }
}
