const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    if (process.env.NODE_ENV === 'DEVELOPMENT') {

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err};

        if(err.name === 'ValidationError'){
            const message = Object.values(err.message).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        if(err.name === 'JsonWebTokenError'){
            const message = 'JSON Web Token is invalid. Try Again!'
            error = new ErrorHandler(message, 400)
        }

        if(err.name === 'TokenExpiredError'){
            const message = 'JSON Web Token is expired. Try Again!'
            error = new ErrorHandler(message, 400)
        }

        error.message = err.message;
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}