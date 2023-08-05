import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriterInterface } from './file-writer.interface.js';

const CHUNK_SIZE = 2 * 16;

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: CHUNK_SIZE,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
    return Promise.resolve();
  }
}
