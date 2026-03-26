import React, { useContext, useState } from 'react';
import '../styles/LoginRegister.css';
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {register} = useContext(AuthContext);

    const handleSubmit = async (e) =>{
      e.preventDefault();
      setError('');

      const inputs = {username, email, password};

      try {
        setIsSubmitting(true);
        await register(inputs);
      } catch (err) {
        setError(err.message || 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }


    }


  return (
    <div className='formContainer'>

        <div className="smart-header">
            <div className="smart-logo">
                <h2 ><Link id='smart-logo-h2' to={'/'}>Connectra</Link></h2>
            </div>
        </div>

        <div className="formWrapper">
        <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputName" className="form-label">Username</label>
                <input type="text" className="form-control" id="exampleInputName" onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e)=>setPassword(e.target.value)} />
              </div>

              {error && <p className="text-danger">{error}</p>}
              
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
          </form>
          <p>Already registered? <Link to={'/login'}>Login</Link></p>
        </div>
    </div>
  )
}

export default Register