import { v2 as cloudinary } from 'cloudinary';

export function createCloudinarySignature(paramsToSign: Record<string, string | number>, apiSecret: string) {
  return cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
}