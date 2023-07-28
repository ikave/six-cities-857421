import got from 'got';
import { MockData } from '../../types/mock-data.type.js';
import { CLICommandInterface } from './cli-command.interface.js';
import { OfferGenerator } from '../../modules/offer-generator/offer-generator.js';
import TSVFileWriter from '../file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CLICommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;
  public async execute(...params: string[]): Promise<void> {
    const [count, filepath, url] = params;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch (error) {
      console.log(error);
    }

    const offerGenerator = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGenerator.generate());
    }
  }
}
