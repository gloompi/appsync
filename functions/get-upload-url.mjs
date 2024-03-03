import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"; 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ulid } from 'ulid';

const { AWS_REGION, BUCKET_NAME } = process.env;

const s3Client = new S3Client({
  useAccelerateEndpoint: true,
  region: AWS_REGION,
});

export const handler = async (event) => {
  const id = ulid()
  let key = `${event.identity.username}/${id}`

  const extension = event.arguments.extension

  if (extension) {
    if (extension.startsWith('.')) {
      key += extension
    } else {
      key += `.${extension}`
    }
  }

  const contentType = event.arguments.contentType || 'image/jpeg'
  if (!contentType.startsWith('image/')) {
    throw new Error('content type should be an image')
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ACL: "public-read",
    ContentType: contentType,
  });

  const signedUrl = getSignedUrl(s3Client, command);

  return signedUrl; 
};