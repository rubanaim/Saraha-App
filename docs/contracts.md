
* Register API

- url: /auth/register
- method: POST
- request [header] : {Content-Type:application/json}
- request [body] : {name,email,password}
- response [status] : 201
- response [header] : {Content-Type:appliction/json}
- response [body] : {message, success,data}

* Verify Account API

- url: /auth/verify
- method: PATCH
- request [header] :{Content-Type:application/json}
- request [body] :{otp,email}
- response [status] : 200/400
- response [header] : {Content-Type:application/json}
- response [body] : {message, success, date}

* Login API
- url: auth/login
- method : POST
- request [header] : {Content-Type:appliction/json}
- request [body] : {email,password}
- response [status] : 200/400
- response [header] : {Content-Type:application/json}
- response [body] : {message,success,data}