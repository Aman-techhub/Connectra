import React, { useState } from 'react';
import '../styles/LoginRegister.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {login} = useContext(AuthContext);

  const handleSubmit = async (e) =>{

    e.preventDefault();
    setError('');
    const inputs = {email, password};

    try {
      setIsSubmitting(true);
      await login(inputs);
    } catch (err) {
      setError(err.message || 'Login failed');
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
        <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"  onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1"  onChange={(e)=>setPassword(e.target.value)} />
              </div>

              {error && <p className="text-danger">{error}</p>}
              
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
          </form>
          <p>Not registered? <Link to={'/register'}>Register now!</Link></p>
        </div>
    </div>
  )
}

export default Login