# Northern Stars Backend Server

## Installation
Download and install npm packages with:
`npm install`

## Run
Run each workers individually with the following debug configuration:

Value | Property 
:---: | :---:
NODE_ENV | development

## Preparations

### MongoDB
Insert this record into `users` collection:
```json
{
    "_id" : ObjectId("5b43d1e3d87238451d06a6fc"),
    "roles" : [ 
        "player", 
        "admin"
    ],
    "username" : "ditrich",
    "password" : "$2a$10$PJcIzBvtoh5WE655GhpW5OZjNGUMQgeNYNwpCOlxw7Gadn.9fE5EW",
    "email" : "filip.ditrich@gmx.us",
    "createdAt" : ISODate("2018-07-09T21:21:39.505Z"),
    "updatedAt" : ISODate("2018-07-16T13:21:07.224Z"),
    "__v" : 0
}
```
This user has Admin Rights.
 
## Working APIs

### Login
Route:
`http://localhost:3000/api/auth/login`

#### Requirements:
Body:
```json
{ "username": "ditrich", "password": "Test123456" }
```

### Registered Users Only *(provisional!)*

**Route:**
`http://localhost:3000/api/auth/protected`

**Requirements:**
+ Headers: `Authorization` = JWT token from login response


### Admin Area *(provisional!)*
**Route:**
`http://localhost:3000/api/auth/admin`
**Requirements:**
+ Headers: `Authorization` = JWT token from login response

### Get Application Response Codes with Messages *(provisional!)*
**Route:**
`http://localhost:3000/api/auth/secret`
**Requirements:**
+ Body:
```json
{ "sp1": "firstpart", "sp2": "secondpart" }
```