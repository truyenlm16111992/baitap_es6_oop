const getAPIInstance = () => axios.create({
    baseURL: "https://64b21450062767bc4826cf02.mockapi.io/api/v1"
});
export {getAPIInstance};