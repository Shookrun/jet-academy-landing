import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/i)) {
      return cb(new BadRequestException('Invalid file type!'), false);
    }
    cb(null, true);
  },
};
