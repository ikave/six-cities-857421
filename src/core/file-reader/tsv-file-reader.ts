import { createReadStream } from 'node:fs';
import { FileReaderInterface } from './file-reader.interface';
import EventEmitter from 'node:events';

const CHUNK_SIZE = 2 ** 4;

export default class TSVFileReader
  extends EventEmitter
  implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf8',
    });

    let remainingData = '';
    let nextLinePosition = -1;

    for await (const chunk of stream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);

        this.emit('row', completeRow);
      }
    }
    this.emit('end');
  }
}
