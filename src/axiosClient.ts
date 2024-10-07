import axios, { AxiosInstance } from 'axios';
import { AuthClient } from './auth-handlers/authClient';
import axiosRetry, { exponentialDelay } from 'axios-retry';

export default class AxiosClient {
    baseUrl: string;
    authClient: AuthClient;
    axiosClient: AxiosInstance = axios.create();

    constructor(baseUrl: string, authClient: AuthClient) {
        this.baseUrl = baseUrl;
        this.authClient = authClient;
        console.log('BaseUrl: ', this.baseUrl);
    }

    public async build() {
        this.configureAxiosInstance();
    }

    // Axios general GET method
    async get(url: string, query?: {}): Promise<any> {
        let response = null;
        if (query) {
            query = { params: query }
        }

        await this.axiosClient.get(url, query)
            .then((res) => {
                response = res.data;
            }).catch((error) => {
                console.log('Error:', error)
                response = error.response;
            })
        return response;
    }

    // Axois general POST method
    async post(url: string, data: any) {
        let response = null;
        await this.axiosClient.post(url, data)
            .then((res) => {
                response = res.data;
            }).catch((error) => {
                response = error.response;
            })
        return response;
    }

    // Axois general PUT method
    async put(url: string, data: any) {
        let response = null;
        await this.axiosClient.put(url, data)
            .then((res) => {
                response = res.data;
            }).catch((error) => {
                response = error.response;
            })
        return response;
    }

    async patch(url: string, data: any) {
        let response = null;
        await this.axiosClient.patch(url, data)
            .then((res) => {
                response = res.data;
            }).catch((error) => {
                response = error.response;
            })
        return response;
    }

    // Axois general DELETE method
    async delete(url: string) {
        let response = null;
        await this.axiosClient.delete(url)
            .then((res) => {
                response = res.data;
            }).catch((error) => {
                response = error.response;
            })
        return response;
    }

    private async configureAxiosInstance() {
        this.axiosClient.defaults.baseURL = this.baseUrl;
        this.axiosClient.interceptors.request.use(async (config) => {
            config.headers['Authorization'] = 'Bearer ' + await this.authClient.getAccessToken();
            return config;
        })
        
        axiosRetry(this.axiosClient, {
            retries: 3,
            retryCondition: this.isRetryableError,
            retryDelay: exponentialDelay,
            onRetry: (err, i, requestConfig) => {
                console.log(`Retry attempt #${i}`);
                console.log('Request:', requestConfig);
            }
        });
    }

    private isRetryableError(error: any) {
        const retryCodes = [401, 522, 502, 503];
        return !!(
            (error.code && !error.response && error.code !== 'ECONNABORTED') ||
            (error.response && retryCodes.includes(error.response.status))
        );
    }
}
