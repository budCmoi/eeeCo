import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createCloudinarySignature } from '@/uploads/providers/cloudinary.provider';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  createSignature(folder = 'eeeco/products') {
    const cloudName = this.configService.get<string>('cloudinary.cloudName') ?? '';
    const apiKey = this.configService.get<string>('cloudinary.apiKey') ?? '';
    const apiSecret = this.configService.get<string>('cloudinary.apiSecret') ?? '';

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        mode: 'demo',
        cloudName,
        apiKey,
        folder,
        timestamp: Math.floor(Date.now() / 1000),
        signature: ''
      };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createCloudinarySignature({ timestamp, folder }, apiSecret);

    return {
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature
    };
  }
}