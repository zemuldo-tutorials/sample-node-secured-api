import axios from 'axios';
import RNSInfo from 'react-native-sensitive-info';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 1000,
});

axiosInstance.interceptors.request.use(async (_options) => {
    const options = _options;
    const token = await RNSInfo.getItem('accessToken', {});
    return {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token,
        }
    };
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response) => response, async (error) => {
    if (error.config.url.includes('/renew_access_token')) {
        authContext.dispatch({ type: 'REQUEST_USER_SIGNIN', payload: true });
        authContext.dispatch({ type: 'SET_REFRESH_ACCESS_TOKEN_FAILED', payload: true });
        return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !error.config.url.includes('/auth/renew_access_token') && error.config?.['axios-retry']?.retryCount < 1) {
        const authenticator = await RNSInfo.getItem('authenticator', {});
        if (authenticator === 'aad_b2c_email_pass') b2cRenewTokens(authContext.dispatch);
        else renewAccessToken(authContext.dispatch);
    }
    return Promise.reject(error);
});


axiosRetry(axiosInstance, {
    retries: 5,
    shouldResetTimeout: true,
    retryCondition: (error) => {
        if (!error || !error.config) return false;
        if (error.config.url.includes('/auth/renew_access_token')) return false;
        if (error?.response?.status in [400, 403, 429, 422, 500]) return false;
        return error?.response?.status === 401 && !refreshAccessTokenFailed;
    },
    retryDelay: (retryCount) => retryCount * 1000,
});

export default axiosInstance;
