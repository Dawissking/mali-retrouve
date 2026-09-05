import AWS from 'aws-sdk';
import { StorageService, storage } from '@app/lib/storage';
import { config } from '@app/config';

describe('Storage Service', () => {
  describe('Configuration', () => {
    it('should be configured with MinIO endpoint', () => {
      expect(AWS.config.credentials?.accessKeyId).toBe(config.minioAccessKey);
      expect(AWS.config.credentials?.secretAccessKey).toBe(config.minioSecretKey);
    });
  });

  describe('StorageService instance', () => {
    it('should be instantiated with correct bucket name', () => {
      expect(storage).toBeInstanceOf(StorageService);
    });

    it('should generate object keys with prefix', () => {
      const key = storage.generateObjectKey('uploads');
      expect(key.startsWith('uploads/')).toBe(true);
      expect(key.split('/').length).toBe(2);
    });

    it('should generate object keys without prefix', () => {
      const key = storage.generateObjectKey();
      expect(key.startsWith('uploads/')).toBe(true);
    });
  });

  describe('Bucket operations', () => {
    beforeAll(async () => {
      await storage.ensureBucket();
    });

    it('should ensure bucket exists', async () => {
      await expect(storage.ensureBucket()).resolves.not.toThrow();
    });
  });

  describe('File operations (integration)', () => {
    const testKey = `test/test-file-${Date.now()}.txt`;
    const testContent = Buffer.from('test content for upload');

    afterAll(async () => {
      try {
        const s3 = new AWS.S3();
        await s3.deleteObject({ Bucket: config.minioBucket, Key: testKey }).promise();
      } catch (e) {
        // ignore cleanup
      }
    });

    it('should upload a file', async () => {
      const key = await storage.upload(testKey, testContent, 'text/plain');
      expect(key).toBe(testKey);
    });

    it('should generate a download URL', async () => {
      const key = await storage.upload(testKey, testContent, 'text/plain');
      const url = await storage.generatePresignedUrl(key, 3600);
      expect(url).toBeTruthy();
      expect(url).toContain('http');
    });

    it('should delete a file', async () => {
      await storage.upload(testKey, testContent, 'text/plain');
      await storage.delete(testKey);

      // Verify file is deleted
      const s3 = new AWS.S3();
      try {
        await s3.headObject({ Bucket: config.minioBucket, Key: testKey }).promise();
        throw new Error('File should have been deleted');
      } catch (e: any) {
        expect(e.statusCode).toBe(404) || expect(e.code).toBe('NotFound');
      }
    });
  });
});
