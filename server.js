/** @format */
const express = require("express");

const fs = require("fs");
const util = require("util");

const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { UploadFile } = require("./s3");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const app = express();

//UPLOAD FILE
app.post("/file", upload.single("file"), async (req, res) => {
	const file = req.file;
	try {
		const result = await UploadFile(file);
		//delete file from local file (from code) from uploads folder
		await unlinkFile(file.path);

		const signedUrl = getSignedUrl({
			keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
			privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
			url: `${process.env.CLOUDFRONT_URL}/${result.Key}`,
			dateLessThan: new Date(Date.now() + 1000 * 60 * 5), //5min
		});

		console.log("SIGNED URL :  ", signedUrl);

		res.send({
			url: signedUrl,
		});
	} catch (error) {
		res.send({
			status: false,
			message: error,
		});
	}
});

app.listen(5000, () => {
	console.log("Server connected!");
});
