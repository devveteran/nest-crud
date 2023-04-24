# What has been done

1. POST /api/users
2. GET /api/user/{userId}
3. GET /api/user/{userId}/avatar
4. DELETE /api/user/{userId}/avatar

# How to run/test

As the program gets running, it'll be listening to 3000 port.

Assumption:
    -   Mongodb is installed on localhost, mongodb://127.0.0.1:27017
        Database being used : test_andrei
        Collection : users
    -   RabbitMQ server is running on localhost.

# 1. POST /api/users

Example : 
    http://localhost:3000/api/users
    payload : {
        "id" : "1",
        "name" : "andrei",
        "email" : "andrei@mail.com",
        "avatar" : ""
    }

    This will send back register a new user to mongodb and send back registerd user information which would be the similar to above if succeded.
    At the same time, RabbitMQ message is sent to queue named 'andrei' and a confirmation email is sent to the email account given above (in this example, andrei@mail.com).
    * I checked RMQ message working, but not with SMTP.

# 2. GET /api/user/{userId}

Example:    
    http://localhost:3000/api/user/6

    Fetch user infomation from https://reqres.in/api/users/6 and returns the user in JSON representation.

# 3. GET /api/user/{userId}

Example: 
    http://localhost:3000/api/user/6/avatar

    This will send back the base64 encoded avatar image which is fetched as the requirement( disk storage & db entry).
    At the same time, the avatar image is being stored in the 'avatars' directory of physical drive root in which the project directory locates. For example, if the project is located in "D:\Projects\Test", the avatar images would be in "D:\avatars" directory.
    The directory would be generated automatically if not exists.

# 4. DELETE /api/user/{userId}/avatar

Example: 
    http://localhost:3000/api/user/6/avatar

    This will delete the avatar image in storage and set the avatar of the user null in the collection.
