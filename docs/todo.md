* NGL App

-features

1. authentication flow:
- register
- send verification email [otp,link]
- verify email using [otp,link]
- login
- forget password
- reset password
- login with Google

2. user flow
- create a new account
- update profile
- view profile
- view all users

3. messages flow
- send message
- view incoming messages
- delete a specific message

* no SQL

1. high availability. [view]
2. eventual consistency. []

* OTP [one-time-password]

- generate OTP. [register,reset-password,vodafone-cash,place-order] //examples where we use otp
- save OTP into DB within the register
- delete OTP after usage verify an account
- delete OTP after OTP after 10 minutes. [TTL] >> time to live

=====================================
* todo session2:
- refactor folder structure
- register 
- verify email using otp
- send otp
- reset password
- login - how to send token in res. [cookie]