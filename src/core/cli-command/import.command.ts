import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer } from '../helpers/offers.js';
import { CLICommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CLICommandInterface {
  public readonly name = '--import';

  static onRow = (row: string) => {
    const offer = createOffer(row);
    console.log(offer);
  };

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('row', ImportCommand.onRow);
    fileReader.on('end', () => console.log('Reading file complete'));

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      console.log(
        `Не удалось импортировать данные из файла по причине: «${error.message}»`
      );
    }
  }
}
