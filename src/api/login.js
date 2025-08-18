// tạo function đăng nhập với api http://localhost:8080/api/travel-blog/auth/login
// sử dụng axios, nhận vào 
// {
//     "username": "harold_luong",
//     "password": "trong123"
// }
// kết quả trả về:
// {
//     "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYXJvbGRfbHVvbmciLCJpZCI6MiwiaWF0IjoxNzU4NTkxMzE1LCJleHAiOjE3NTg2Nzc3MTV9.BG3np-LftfVW5i_-7-pgLj4953bVn0-i2Kf-w_f53oI",
//     "tokenType": "Bearer",
//     "expiresIn": 86400000,
//     "expiresAt": 1758677715305,
//     "user": {
//         "id": 2,
//         "username": "harold_luong",
//         "email": "harold@example.com"
//     }
// }
import axios from 'axios';
const API_URL = 'http://localhost:8080/api/travel-blog/auth/login';

export const loginApi = async ({ username, password }) => {
    try {
        const response = await axios.post(API_URL, {
            username,
            password
        });
        return response.data;
    }
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
