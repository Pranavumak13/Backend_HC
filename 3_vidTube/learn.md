# Hooks and methods in mongoose with JWT

## 1. Hooks --> Pre and Post
- Pre --> Just before saving info to DB we can perform some ADDITIONAL Operation
- Post --> After saving info to DB and before sending the response we can perform SOME Operation

## 2. Methods
Just like we have User.findById or User.findByEmail
similarly instead of FIND we can create our CUSTOM Methods

### Task: Encrypt the PASSWORD just before saving them in the DB | ref: users.model.js

--> Module Used: 1. bcrypt

## Methods to be used:
1. isPasswdCorrect()
2. isLoggedIn()
3. When LoggedIn -> Generate Some Access Tokens and Refresh Tokens.

- Access Tokens: Short Term | Take a token and do the task
- Refresh Tokens: Long Term Token | Store in DB to keep track of user, we can also flush this and ask user to login again


## JWT Tokens: JSON Web Tokens
-> provide Stateless authentication


## Handling Files in MERN Application

### 1. Cookie
--> Module: Cookie-Parser

### 2. Multer
--> Module: multer
--> Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
--> Multer will not process any form which is not multipart (multipart/form-data).

--> router.route("/").get(healthcheck)
--> The multer needs to be inserted between the route("/") and the controller(.get(healthcheck))

--> For complex application, always prefer to store it on a disk using diskStorage
--> ref: multer.middleware.js