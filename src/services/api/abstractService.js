/* eslint-disable class-methods-use-this */
import axios from 'axios';

export default class AbstractService {
  constructor(baseUrl) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  getHeaders(lang) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': lang || 'it',
      'Cache-Control': 'no-cache',
      'x-no-recaptcha': 'vinbacco',
    };

    const auth = (window.localStorage.getItem('authFE')) ? JSON.parse(window.localStorage.getItem('authFE')) : null;

    if (!!auth && !!auth.access_token) {
      headers.Authorization = `${(auth.token_type) ? auth.token_type : 'Bearer'} ${auth.access_token}`;
    }

    return headers;
  }

  get(path) {
    this.axiosInstance.defaults.headers = this.getHeaders();
    return this.axiosInstance.get(path);
  }

  post(path, body) {
    this.axiosInstance.defaults.headers = this.getHeaders();
    return this.axiosInstance.post(path, JSON.stringify(body));
  }

  put(path, body) {
    this.axiosInstance.defaults.headers = this.getHeaders();
    return this.axiosInstance.put(path, JSON.stringify(body));
  }

  delete(path) {
    this.axiosInstance.defaults.headers = this.getHeaders();
    return this.axiosInstance.delete(path);
  }

  upload(path, fileData, update = false) {
    this.axiosInstance.defaults.headers = this.getHeaders();
    this.axiosInstance.defaults.headers['Content-Type'] = 'multipart/form-data';

    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('filename', fileData.file.name);
    formData.append('minetype', fileData.file.type);
    formData.append('type', fileData.type);

    if (update === true) return this.axiosInstance.put(path, formData);
    return this.axiosInstance.post(path, formData);
  }
}
