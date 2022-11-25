/* make sure when you deploy you are using the same .env  */

require('dotenv').config();
let bucketName = process.env.BUCKET_NAME;
console.log(`Start upload to ${bucketName}`);

const { promises: fs, createReadStream } = require('fs');
const path = require('path');
const { S3 } = require('aws-sdk');

// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

const bucketName = process.env.S3_BUCKET_NAME;


const uploadDir = async (s3Path, bucketName) => {
  // Recursive getFiles from
  // https://stackoverflow.com/a/45130990/831465

  async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      })
    );
    return Array.prototype.concat(...files);
  }

  const files = await getFiles(s3Path);
  const uploads = files.map(filePath =>
    s3
      .putObject({
        Key: path.relative(s3Path, filePath),
        Bucket: bucketName,
        Body: createReadStream(filePath)
      })
      .promise()
      .catch(err => {
        console.log(`fail to upload ${filePath}`);
      })
  );
  return Promise.all(uploads);
};

const uploadProcess = async () => {
  await uploadDir(path.resolve('./out'), bucketName);
  console.log('Upload finish');
};
uploadProcess();
