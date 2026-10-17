* User

- name [String,required,minlength:3, maxLength:20, trim]
- email [String,required,unique,lowercase,trim] todo:check email foemat [regex]
- password [String,required,minlength:6] >> optional in case login with google 
- provider [String] enum:['system','google','instagram']
- profilePic [String]
- isVerified [Boolean] default:[false],
- isDeleted [Boolean] default:[false],
- friends [Array]
- messages [Array]

===========================

* Message
- content [String,required,minlength:1,maxlength:200,trim]
- receiver [ObjectId,required,ref:User]
- sender [ObjectId, ref:User]
- isDeleted [Boolean] default [false]

=============================

* OTP

- value [String,required,length:6]
- email [String,required,trim,lowercase]
- expiryAt [date]
- createdAt [date]
- updatedAt [date]