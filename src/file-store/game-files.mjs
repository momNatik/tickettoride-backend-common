import { fileURLToPath } from "node:url";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

// export async function main() {
//   await s3Client.send(
//     new PutObjectCommand({
//       Bucket: bucketName,
//       Key: "my-first-object.txt",
//       Body: "Hello JavaScript SDK!",
//     })
//   );

//   await s3Client.send(
//     new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
//   );

//   if (process.argv[1] === fileURLToPath(import.meta.url)) {
//     main();
//   }
// }

export async function GetFileAsync(key) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEYID,
      secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
  });

  const bucketName = process.env.AWS_BUCKET_NAME;

  return await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

export async function GetFilesByPrefixAsync(prefix) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEYID,
      secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: prefix,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);

    if (data.Contents) {
      const fileList = data.Contents.map((object) => object.Key);
      return fileList;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Ошибка при получении списка файлов:", err);
    throw err;
  }
}
