import crypto from "node:crypto";

export  function generateOtp(){
  const code = crypto.randomInt(100000,999999).toString();
  return code;
}