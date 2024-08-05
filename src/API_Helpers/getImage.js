import axios from 'axios';
import { api_url as API_URL } from '../assets/constants/api_url'

export const getImage = (payload) => {
    return axios({
        method: 'GET',
            responseType: 'blob',
            url: API_URL + 'getImage',
            params: {
                imageId: payload.imageId,
                lang: payload.lang
            },
            headers: {
              'Authorization': payload.tokenType + ' ' + payload.accessToken
            }
    })
}