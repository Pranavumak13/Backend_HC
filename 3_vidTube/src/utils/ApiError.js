// Error is alrady a Class present in NodeJs, we just have to EXTEND it with our usecase
class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    ){
        super(message) // used super to call the constructor of its parent class to access the parent's properties and methods.
        this.statusCode = statusCode,
        this.date = null,
        this.message = message
        this.success = false
        this.errors = errors

        // stack only occurs in dev env not in prod env hence adding a check for that
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}