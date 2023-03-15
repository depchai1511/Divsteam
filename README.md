# Cách chạy code demo
1. Tải cơ sở dữ liệu [Postgresql](https://www.postgresql.org/download/).

2. Sau khi cài đặt, tạo ra một cơ sở dữ liệu 

3. Clone dự án về máy tính 

4. Mở file `.env ` trong đó sẽ thêm đoạn code sau :
    ```
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_DATABASE=
    ```
5. Chạy các câu lệnh sau :   

    ```
    npm init  
    npm install express body-parser pg jsonwebtoken dotenv cors
    ```
6. Tải nodemon để tự động khởi động lại server Node.js mỗi khi thực hiện một thay đổi trong mã nguồn:
    ```
    npm install nodemon --save-dev
    ```
7. Chạy chương trình :
    ```
    nodemon index.js
    ```
8. Tải [Postman](https://www.postman.com/downloads/) để dễ dàng test API hơn.



# Cách để test api:
1. Tạo một request mới trong Postman. Chọn phương thức POST hoặc GET và nhập URL của API GraphQL.
2. Chọn tab Body và chọn kiểu GraphQL. Sau đó sẽ nhập operation và variables :  
    **Operation** :   
    ```javascript   
    //Sign In
    mutation Mutation($username: String!, $password: String!) {
        signIn(username: $username, password: $password)
    }
    ```
    ```javascript       
    //Sign Up
    mutation SignUp($fullName: String!, $email: String!, $password: String!, $username: String!) {
    signUp(full_name: $fullName, email: $email, password: $password, username: $username)
    }
    ```
    ```javascript       
    //Get user by id
    query User($userId: ID!) {
    user(id: $userId) {
        user_id
        full_name
        email
        username
        password
    }
    }
    ```
    ```javascript       
    //Get all users 
    query Users {
    users {
        user_id
        full_name
        email
        username
        password
    }
    }
    ```

    **Variables** :   
    ```javascript   
    //Sign In
    {  
    "username": "",
    "password": "",
    }
    ```
    ```javascript       
    //Sign Up
    {  
    "fullName": "",
    "email": "",  
    "password": "",
    "username": ""
    }
    ```

















