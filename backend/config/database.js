const mongoose = require('mongoose');
require('dotenv').config();


exports.connectDB = () => {
    console.log('\n📡 Attempting to connect to MongoDB...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
    
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log('✅✅✅ DATABASE CONNECTED SUCCESSFULLY ✅✅✅');
            console.log('Database Host:', mongoose.connection.host);
            console.log('Database Name:', mongoose.connection.name);
            console.log('======================================\n');
        })
        .catch(error => {
            console.log('\n❌❌❌ ERROR WHILE CONNECTING TO DATABASE ❌❌❌');
            console.log('Error message:', error.message);
            console.log('Full error:', error);
            console.log('======================================\n');
            process.exit(1);
        })
};

