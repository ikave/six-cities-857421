import { CLICommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CLICommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
      Программа для подготовки данных для REST API сервера.

      Пример: cli.js --<command> [--arguments]

      Команды:

      --version:                   # выводит номер версии
      --help:                      # печатает этот текст
      --import <path> <username> <password> <host> <dbname> <salt>:             # импортирует данные из TSV
      --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных`);
  }
}
