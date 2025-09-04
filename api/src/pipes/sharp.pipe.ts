import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  constructor(private folder?: string) {}

  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return null;

    const originalName = path.parse(image.originalname).name;
    const filename = `${originalName}-${Date.now()}.webp`;
    const folder = this.folder || '';
    const uploadPath = path.join(process.cwd(), 'uploads', folder);
    const outputPath = path.join(uploadPath, filename);

    try {
      await fs.mkdir(uploadPath, { recursive: true });

      await sharp(image.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 90 })
        .toFile(outputPath);

      return filename;
    } catch (error) {
      console.error('Sharp processing error:', error);
      try {
        await fs.unlink(outputPath).catch(() => {});
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      throw new BadRequestException(
        `Image processing failed: ${error.message}`,
      );
    }
  }
}
