# Hooks and methods in mongoose with JWT

## 1. Hooks --> Pre and Post
Pre --> Just before saving info to DB we can perform some ADDITIONAL Operation
Post --> After saving info to DB and before sending the response we can perform SOME Operation

## 2. Methods
Just like we have User.findById or User.findByEmail
similarly instead of FIND we can create our CUSTOME Methods

## Task: Encrypt the PASSWORD just before saving them in the DB

--> Module Used: 1. bcrypt

## Methods to be used:
1. isPasswdCorrect()
2. isLoggedIn()
3. When LoggedIn -> Generate Some Access Tokens and Refresh Tokens.

- Access Tokens: Short Term | Take a token and do the task
- Refresh Tokens: Long Term Token | Store in DB to keep track of user, we can also flush this and ask user to login againg


## JWT Tokens: JSON Web Tokens
-> provide Stateless authentication
