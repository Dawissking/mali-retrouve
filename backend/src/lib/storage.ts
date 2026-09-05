import AWS from 'aws-sdk';
import { config } from '../config';
import { logger } from './logger';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: config.minioAccessKey,
  secretAccessKey: config.minioSecretKey,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: config.minioRegion,
});

let s3Client: AWS.S3 | null = null;

function getS3(): AWS.S3 {
  if (!s3Client) {
    s3Client = new AWS.S3({
      endpoint: `${config.minioUseSsl ? 'https' : 'http'}://${config.minioEndpoint}:${config.minioPort}`,
    });
  }
  return s3Client;
}

export class StorageService {
  private bucket: string;

  constructor() {
    this.bucket = config.minioBucket;
    logger.info({ bucket: this.bucket }, 'Storage service initialized');
  }

  async ensureBucket(): Promise<void> {
    try {
      await getS3().headBucket({ Bucket: this.bucket }).promise();
    } catch {
      await getS3().createBucket({ Bucket: this.bucket }).promise();
    }
  }

  generateObjectKey(prefix: string = 'uploads'): string {
    return `${prefix}/${uuidv4()}`;
  }

  async upload(
    key: string,
    body: Buffer,
    mimeType: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    await getS3().upload({ Bucket: this.bucket, Key: key, Body: body, ContentType: mimeType, ...(metadata ? { Metadata: metadata } : {}), ServerSideEncryption: 'AES256' }).promise();
    return key;
  }

  async generatePresignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    return getS3().getSignedUrl('getObject', { Bucket: this.bucket, Key: key, Expires: expiresInSeconds });
  }

  async delete(key: string): Promise<void> {
    await getS3().deleteObject({ Bucket: this.bucket, Key: key }).promise();
  }
}

export const storage = new StorageService();
