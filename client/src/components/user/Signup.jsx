import React,{ useState } from 'react';
import styled from 'styled-components';
import hide from '../../assets/hide.png';
import view from '../../assets/view.png';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import ApiConfig from '../config/LocalConfigApi';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword)
    const [data, setData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    const dataCheck = ()=>{

        if(data.password === '' || data.confirmPassword === '' || data.email === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required',
            })
            return false
        }   

        if(data.password !== data.confirmPassword){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password do not match',
            })
            return false
        }

        if(data.password.length < 8){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password should be atleast 8 characters',
            })
            return false
        }

        if(data.email === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email is',
            })
            return false
        }
        // email regex
        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(data.email)){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid email',
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            if(dataCheck()){

                const response = await axios.post(`${ApiConfig.apiURL}signup`, data);

                if(response.status === 201){
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Account created successfully',
                    }).then((result)=>{
                        if(result.isConfirmed){
                            window.location.href = '/';
                        }
                    })
                }else if(response.status === 299){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email already exists',
                    })
                }
            }
        } catch(err){
            console.error("Error: ", err);
            Swal.fire({
                title: "Error!",
                text: "An error occurred while creating the account.",
                icon: "error"
            });
        }
    }
  return (
    <div className='bodyLog flex items-center justify-center h-screen'>
        <StyledWrapper>
            <div className="container">
                <div className="heading">Sign up</div>
                <form action className="form">
                <input className="input" type="email" name="email" id="email" placeholder="E-mail"
                onChange={(e) => handleChange(e)} />
                <div className="password-container">
                    <input className="input" type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Password"
                    onChange={(e) => handleChange(e)} />
                    <span className='toggle-password'
                    onClick={togglePasswordVisibility}>
                        {showPassword ? <img src={view} /> : <img src={hide} />}
                    </span>
                </div>
                <input className="input" type={showPassword ? "text" : "password"}  name="confirmPassword" id="confirmPassword" placeholder="Confirm Password"
                onChange={(e) => handleChange(e)} />
                <span className="forgot-password"><a href="/">Already have an account ?</a></span>
                <input className="login-button" type="button" defaultValue="Sign Up" 
                onClick={(e)=> handleSubmit(e)}/>
                </form>
                <span className="agreement"><a href="#">Learn user licence agreement</a></span>
            </div>
            </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`

  .container {
    width: 450px;
    background: #F8F9FD;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }

  .form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
  }

  .form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }

  .form .forgot-password a {
    font-size: 11px;
    color: #0099ff;
    text-decoration: none;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
  }

  .form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
  }

  .form .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
  }

  .social-account-container {
    margin-top: 25px;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 12px;
    color: rgb(170, 170, 170);
  }

  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 5px;
  }

  .social-account-container .social-accounts .social-button {
    background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
    border: 5px solid white;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
  }

  .social-account-container .social-accounts .social-button .svg {
    fill: white;
    margin: auto;
  }

  .social-account-container .social-accounts .social-button:hover {
    transform: scale(1.2);
  }

  .social-account-container .social-accounts .social-button:active {
    transform: scale(0.9);
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
  }

  .agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 10px;
  }
    .password-container {
    position: relative;
    width: 100%;
  }

  .password-input {
    padding-right: 40px;
  }

  .toggle-password {
    position: absolute;
    top: 60%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 18px;
  }

  .toggle-password img{
    width: 20px;
    height: 20px;
  }
  
  `;

export default Signup;
