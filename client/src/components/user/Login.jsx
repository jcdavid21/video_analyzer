import React,{useState} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import hide from '../../assets/hide.png';
import view from '../../assets/view.png';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import ApiConfig from '../config/LocalConfigApi';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordVisibility = () => setShowPassword(!showPassword);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const checkInput = ()=>{
        if(formData.email === '' || formData.password === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'All fields are required',
            })
            return false
        }

        if(formData.password.length < 8){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password should be atleast 8 characters',
            })
            return false
        }

        // email regex
        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(formData.email)){
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Invalid email',
            })
            return false
        }

        return true
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()

        try{
            if(!checkInput()) return
            const response = await axios.post(`${ApiConfig.apiURL}login`, formData)
            console.log(response)
            if(response.data.error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.error,
                })
                return false
            }

            if(response.status === 200){
                localStorage.setItem('acc_id', JSON.stringify(response.data.acc_id))
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                }).then((result)=>{
                    if(result.isConfirmed){
                        window.location.href = '/home'
                    }
                })
            }else if (response.status === 299){
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: response.data.error,
                })
                return false
            }
            

        }catch(err){
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong',
            })
            return false
        }
    }
  return (
    <div className='bodyLog flex items-center justify-center h-screen'>
        <StyledWrapper>
            <div className="container">
                <div className="heading">Sign In</div>
                <form action className="form">
                <input required className="input" type="email" name="email" id="email" placeholder="E-mail"
                onChange={(e)=> handleChange(e)}/>
                <div className="password-container">
                    <input required className="input" type={showPassword ? "text" : "password"} name="password" id="password" placeholder="Password"
                    onChange={(e)=> handleChange(e)} />
                    <span className='toggle-password' onClick={passwordVisibility}>
                        {showPassword ? <img src={view} /> : <img src={hide} />}
                    </span>
                </div>
                <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
                <input className="login-button" type="button" defaultValue="Sign In"
                onClick={(e) => handleSubmit(e)} />
                </form>
                <div className="social-account-container">
                <span className="title">
                    <span className='mr-1 text-blue-500'>
                        <Link to={'/signup'}>
                         Create an account
                        </Link>
                    </span>
                    Or Sign in with</span>
                <div className="social-accounts">
                    <button className="social-button google">
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg></button>
                    <button className="social-button apple">
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    </button>
                    <button className="social-button twitter">
                    <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                    </svg>
                    </button>
                </div>
                </div>
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
  }`;

export default Login;
