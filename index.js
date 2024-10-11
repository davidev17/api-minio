import express from 'express';
import pkg from 'aws-sdk';
const { S3 } = pkg;
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // Definir a variável upload

const s3 = new S3({
  endpoint: 'http://10.101.22.221:9000',
  accessKeyId: 'PX8BjE8uL3',
  secretAccessKey: 'XacDdNhLV6',
  sslEnabled: false,
  s3ForcePathStyle: true,
});

const app = express();
app.use(cors());
app.use(morgan('dev'));

const uploadHandler = async (req, res) => {
  try {
    await s3.putObject({
      Bucket: 'uploads',
      Key: req.file.originalname,
      Body: req.file.buffer,
    }).promise();
    return res
      .status(201)
      .send({
        message: `File "${req.file.originalname}" uploaded`
      });
  } catch (e) {
    console.log(e);
      return res
        .status(500)
        .send({ error: e.message })
  }
}

app.route('/upload').post(
  multer({ storage: multer.memoryStorage() }).single('file'),
  uploadHandler,
);

app.listen(3002, () => console.log('[READY]')); 