import {toMs} from "../../../pkg/utils/time.js";

export function setCookies(res,accessToken, refreshToken){
    //This is an Express method used to send a cookie from the server to the browser.
    res.cookie('access_token', accessToken, {
        httpOnly: true, //set or modify   -> access within request
        maxAge: toMs(1,'hours'),
        //Only send this cookie to the refresh-token endpoint (and paths under that path).
        path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true, //set or modify   -> access within request
        maxAge: toMs(7,'days'),
        //Only send this cookie to the refresh-token endpoint (and paths under that path).
        path: '/api/auth/refresh-token',
    });

}