import Axios from "axios";
export const axios = Axios.create({
    baseURL : "http://localhost:3000",
    headers: {AUTH : "Authenticaion"},
    timeout: 3000,
})