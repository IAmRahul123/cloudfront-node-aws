/** @format */
require("dotenv").config();

const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

// dq8zr9k6bkr15.cloudfront.net
const region = process.env.AWS_REGION_NAME;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKey = process.env.AWS_ACCES_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
	region: region,
	accessKeyId: accessKey,
	secretAccessKey: secretKey,
});

//AWS FUNCTION FOR UPLOAD
//upload file to aws s3
function UploadFile(file) {
	const fileStream = fs.createReadStream(file.path);
	const uploadParams = {
		Bucket: bucketName,
		Body: fileStream,
		Key: Date.now() + file.originalname,
	};
	return s3.upload(uploadParams).promise();
}

exports.UploadFile = UploadFile;
