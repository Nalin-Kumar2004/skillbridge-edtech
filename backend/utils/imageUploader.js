const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret',
    }
});

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        console.log('\n☁️  AWS S3 UPLOAD STARTED (Replaced Cloudinary)');
        console.log('File name:', file.name);
        console.log('Target folder:', folder);

        const fileContent = fs.readFileSync(file.tempFilePath);
        
        // Generate a unique filename
        const uniqueFileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || 'skillbridge-bucket',
            Key: uniqueFileName,
            Body: fileContent,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const secure_url = `https://${params.Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uniqueFileName}`;
        
        console.log('✅ AWS S3 UPLOAD SUCCESSFUL');
        console.log('S3 URL:', secure_url);
        
        // Return object in same format as Cloudinary so we don't break existing controllers
        return {
            secure_url: secure_url,
            public_id: uniqueFileName
        };
    }
    catch (error) {
        console.log("\n❌❌❌ ERROR WHILE UPLOADING TO AWS S3 ❌❌❌");
        console.log('Error:', error.message);
        throw error;
    }
}

exports.deleteResourceFromCloudinary = async (url) => {
    if (!url) return;

    try {
        // Extract the Key from the S3 URL
        // Example URL: https://bucket-name.s3.region.amazonaws.com/folder/filename.jpg
        const urlParts = url.split('.amazonaws.com/');
        if(urlParts.length !== 2) return;
        
        const key = urlParts[1];

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || 'skillbridge-bucket',
            Key: key,
        };

        const command = new DeleteObjectCommand(params);
        const result = await s3Client.send(command);
        
        console.log(`✅ Deleted resource from S3 with key: ${key}`);
        return result;
    } catch (error) {
        console.error(`Error deleting resource from S3:`, error);
        throw error;
    }
};