import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import mime from 'mime';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from './middleware.interface.js';
import { ALLOWED_IMAGE_EXTENSIONS } from '../constants.js';
import HttpError from '../errors/http-error.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(private uploadDirectory: string, private reqFileName: string) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename(_req, file, callback) {
        const ext = mime.extension(file.mimetype);
        if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
          return next(
            new HttpError(
              StatusCodes.BAD_REQUEST,
              'Incorrect file extension',
              'UploadFileMiddleware'
            )
          );
        }
        const fileId = nanoid();
        callback(null, `${fileId}.${ext}`);
      },
    });

    const uploadFile = multer({ storage }).single(this.reqFileName);
    uploadFile(req, res, next);
  }
}
