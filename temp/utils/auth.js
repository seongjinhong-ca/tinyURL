import axios from 'axios';

export const loginuser = async (email, password) =>{
    // post request
    const response = await axios.post('users/login', {email, password});

};

export const signUpuser = async (email, password) => {
    const response = await axios.post("users/register", {email, password});
};