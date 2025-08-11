import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export async function SaveFileAsync(key, body) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: "image/png",
    ContentLength: body.length
  });

  return await ExecuteCommandAsync(command);
}

export async function GetFileAsync(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  return await ExecuteCommandAsync(command);
}

export async function DeleteFileAsync(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  return await ExecuteCommandAsync(command);
}

// export async function GetFilesByPrefixAsync(prefix) {
//   const s3Client = CreateS3Client();

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Prefix: prefix,
//   };

//   try {
//     const command = new ListObjectsV2Command(params);
//     const data = await s3Client.send(command);

//     if (data.Contents) {
//       const fileList = data.Contents.map((object) => object.Key);
//       return fileList;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.error("Ошибка при получении списка файлов:", err);
//     throw err;
//   }
// }

function CreateS3Client() {
  return new S3Client({
    requestStreamBufferSize: 32 * 1024,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEYID,
      secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
  });
}

async function ExecuteCommandAsync(command) {
  const s3Client = CreateS3Client();

  return await s3Client.send(command);
}
