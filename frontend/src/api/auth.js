import api from '../services/api';

const API_BASE_URL = 'http://localhost:4000';

export async function loginApi({ usrUsername, usrPassword }) {
  try {
    const res = await api.post(`${API_BASE_URL}/api/auth/usrLogin`, {
      usrUsername,
      usrPassword
    });
    const data = res.data;
    if (!data.success) {
      if (data.code) {
        return { error: data };
      }
      throw new Error(data.message || 'خطا در ورود');
    }
    return data;
  } catch (err) {
    if (err.response && err.response.data) {
      return { error: err.response.data };
    }
    return { error: err.message || 'ارتباط با سرور برقرار نشد.' };
  }
}

export async function registerApi({ usrUsername, usrPassword, perName, perLastName, usrAvatar }) {
  try {
    const res = await api.post(`${API_BASE_URL}/api/auth/usrRegister`, {
      usrUsername,
      usrPassword,
      perName,
      perLastName,
      usrAvatar
    });
    const data = res.data;
    if (!data.success) {
      if (data.code) {
        return { error: data };
      }
      throw new Error(data.message || 'خطا در ثبت‌نام');
    }
    return data;
  } catch (err) {
    if (err.response && err.response.data) {
      return { error: err.response.data };
    }
    return { error: err.message || 'ارتباط با سرور برقرار نشد.' };
  }
} 