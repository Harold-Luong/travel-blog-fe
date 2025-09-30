// tạo function đăng nhập với api http://localhost:8080/api/travel-blog/auth/login
// sử dụng axios, nhận vào 
// {
//     "email": "harold@example.com",
//     "password": "trong123"
// }
// kết quả trả về:
// {
//     "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYXJvbGRfbHVvbmciLCJpZCI6MiwiaWF0IjoxNzU4NTkxMzE1LCJleHAiOjE3NTg2Nzc3MTV9.BG3np-LftfVW5i_-7-pgLj4953bVn0-i2Kf-w_f53oI",
//     "tokenType": "Bearer",
//     "expiresAt": 1758677715305,
// }
import axios from 'axios';

export const loginApi = async (form) => {
    //const API_URL = 'https://travel-blog-harold.onrender.com/auth/login';

    const api = 'http://localhost:8080/api/travel-blog/auth/login';

    try {
        const response = await axios.post(api, form);
        return response.data;
    }
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const loginGoogle = async (body) => {
    try {
        const response = await axios.post("http://localhost:8080/api/travel-blog/auth/google", body);
        return response.data;
    }
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const registerApi = async (form) => {
    try {
        const api = 'http://localhost:8080/api/travel-blog/auth/register';
        const response = await axios.post(api, form);
        return response.data;
    }
    catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};


export const getMeApi = async (token) => {
    try {
        const api = "http://localhost:8080/api/travel-blog/me";
        const response = await axios.get(api, {
            headers: {
                "Authorization": `Bearer ${token}`,   // thêm JWT vào header
            }
        });
        return response.data;
    } catch (error) {
        console.error("Get user error:", error);
        throw error;
    }
};

export const updateUserApi = async (form) => {
    const token = localStorage.getItem("accessToken");
    try {
        const api = "http://localhost:8080/api/travel-blog/me/update";
        const response = await axios.post(api, form, {
            headers: {
                "Authorization": `Bearer ${token}`,   // thêm JWT vào header
                "Content-Type": "multipart/form-data" // nếu gửi FormData
            }
        });
        return response.data;
    } catch (error) {
        console.error("Update user error:", error);
        throw error;
    }
};
