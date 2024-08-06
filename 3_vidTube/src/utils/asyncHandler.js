// this file is generated to handle errors gracefully, can't write the try-catch block dozens of time and also handling async-await request
// we are doing this, with the help of Higher Order Function HOF in JS


const asyncHandler = (requestHandler) =>{
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err))
    }
}

export {asyncHandler}
