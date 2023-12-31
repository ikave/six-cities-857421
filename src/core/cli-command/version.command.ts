import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CLICommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CLICommandInterface {
  public readonly name = '--version';

  static readVersion(): string {
    const contentPageJSON = readFileSync(
      path.resolve('./package.json'),
      'utf8'
    );
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute(): Promise<void> {
    const version = VersionCommand.readVersion();
    console.log(version);
  }
}
