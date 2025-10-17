import axios from 'axios'

const API_ENDPOINT = {
    GET_USERS: "https://dummyjson.com/users"
}

export const fetchCustomerData = async () => {
    const response = await axios.get(API_ENDPOINT.GET_USERS);
    return response.data.users
}