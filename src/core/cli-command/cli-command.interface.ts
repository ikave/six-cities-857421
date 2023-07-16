export interface CLICommandInterface {
  readonly name: string;
  execute(...params: string[]): void;
}
