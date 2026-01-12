// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();


// ================ AUTH ================
// user Authentication by checking token validating
exports.auth = (req, res, next) => {
    try {
        console.log('\n========== AUTH MIDDLEWARE STARTED ==========');
        console.log('Request URL:', req.originalUrl);
        console.log('Request Method:', req.method);
        
        // extract token by anyone from this 3 ways
        const token = req.body?.token || req.cookies.token || req.header('Authorization').replace('Bearer ', '');
        
        console.log('Token from body:', req.body?.token ? 'Present' : 'Missing');
        console.log('Token from cookies:', req.cookies?.token ? 'Present' : 'Missing');
        console.log('Token from headers:', req.header('Authorization') ? 'Present' : 'Missing');
        console.log('Final token extracted:', token ? 'Present' : 'Missing');

        // if token is missing
        if (!token) {
            console.log('❌ AUTH FAILED: Token is missing');
            return res.status(401).json({
                success: false,
                message: 'Token is Missing'
            });
        }

        // console.log('Token ==> ', token);
        // console.log('From body -> ', req.body?.token);
        // console.log('from cookies -> ', req.cookies?.token);
        // console.log('from headers -> ', req.header('Authorization')?.replace('Bearer ', ''));

        // verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token verified successfully');
            console.log('Decoded user info:', {
                email: decode.email,
                id: decode.id,
                accountType: decode.accountType
            });
            
            req.user = decode;
            console.log('User attached to request:', req.user.id, req.user.accountType);
        }
        catch (error) {
            console.log('❌ Error while decoding token');
            console.log('Token decode error:', error.message);
            return res.status(401).json({
                success: false,
                error: error.message,
                messgae: 'Error while decoding token'
            })
        }
        // go to next middleware        console.log('✅ AUTH MIDDLEWARE PASSED - Moving to next middleware');
        console.log('========== AUTH MIDDLEWARE ENDED ==========\n');        next();
    }
    catch (error) {
        console.log('Error while token validating');
        console.log(error);
        return res.status(500).json({
            success: false,
            messgae: 'Error while token validating'
        })
    }
}





// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user?.accountType != 'Student') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for student'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with student accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with student accountType'
        })
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    try {
        console.log('\n========== IS INSTRUCTOR MIDDLEWARE STARTED ==========');
        console.log('User account type:', req.user?.accountType);
        console.log('User ID:', req.user?.id);
        
        if (req.user?.accountType != 'Instructor') {
            console.log('❌ INSTRUCTOR CHECK FAILED: User is not an Instructor');
            console.log('❌ INSTRUCTOR CHECK FAILED: User is not an Instructor');
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Instructor'
            })
        }
        // go to next middleware
        console.log('✅ INSTRUCTOR CHECK PASSED');
        console.log('========== IS INSTRUCTOR MIDDLEWARE ENDED ==========\n');
        next();
    }
    catch (error) {
        console.log('❌ Error while cheching user validity with Instructor accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Instructor accountType'
        })
    }
}


// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        // console.log('User data -> ', req.user)
        if (req.user.accountType != 'Admin') {
            return res.status(401).json({
                success: false,
                messgae: 'This Page is protected only for Admin'
            })
        }
        // go to next middleware
        next();
    }
    catch (error) {
        console.log('Error while cheching user validity with Admin accountType');
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while cheching user validity with Admin accountType'
        })
    }
}


