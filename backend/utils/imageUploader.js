const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        console.log('\n☁️  CLOUDINARY UPLOAD STARTED');
        console.log('File name:', file.name);
        console.log('File size:', file.size, 'bytes');
        console.log('File mimetype:', file.mimetype);
        console.log('Temp file path:', file.tempFilePath);
        console.log('Target folder:', folder);
        
        const options = { folder };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        // options.resourse_type = 'auto';
        options.resource_type = 'auto';
        
        console.log('Upload options:', options);
        console.log('Uploading to Cloudinary...');
        
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        console.log('✅ CLOUDINARY UPLOAD SUCCESSFUL');
        console.log('Cloudinary URL:', result.secure_url);
        console.log('Public ID:', result.public_id);
        
        return result;
    }
    catch (error) {
        console.log("\n❌❌❌ ERROR WHILE UPLOADING IMAGE TO CLOUDINARY ❌❌❌");
        console.log('Error message:', error.message);
        console.log('Full error:', error);
        throw error;
    }
}



// Function to delete a resource by public ID
exports.deleteResourceFromCloudinary = async (url) => {
    if (!url) return;

    try {
        const result = await cloudinary.uploader.destroy(url);
        console.log(`Deleted resource with public ID: ${url}`);
        console.log('Delete Resourse result = ', result)
        return result;
    } catch (error) {
        console.error(`Error deleting resource with public ID ${url}:`, error);
        throw error;
    }
};