import React, { useContext, useEffect, useRef, useState} from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';
import {CgEnter} from 'react-icons/cg';
import {RiVideoAddFill} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Groups2Icon from '@mui/icons-material/Groups2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BoltIcon from '@mui/icons-material/Bolt';


import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';


const Home = () => {

  const homePageRef = useRef(null);

  
  const [roomName, setRoomName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('none');
  const [newMeetTime, setNewMeetTime] = useState('none');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMeetError, setCreateMeetError] = useState('');
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);



  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const {logout} = useContext(AuthContext);
  
  const navigate = useNavigate();
  
  const handleLogIn =() =>{
    navigate('/login');
  }
  
  const handleLogOut =(e)=>{
    e.preventDefault();
    logout();
  }
  

  const {socket, setMyMeets, newMeetType, setNewMeetType} = useContext(SocketContext);

  const userId = localStorage.getItem("userId") || "";

  const handleOpenCreateModal = () => {
    setCreateMeetError('');
    setIsCreateModalOpen(true);
  }

  const handleCloseCreateModal = () => {
    setCreateMeetError('');
    setIsCreateModalOpen(false);
  }

  const handleCreateRoom = () =>{
    if (!roomName.trim()) {
      setCreateMeetError('Please enter a meet name.');
      return;
    }

    const meetType = newMeetType && newMeetType !== 'none' ? newMeetType : 'instant';

    if (meetType === 'scheduled' && (!newMeetDate || !newMeetTime || newMeetDate === 'none' || newMeetTime === 'none')) {
      setCreateMeetError('Please choose date and time for a scheduled meet.');
      return;
    }

    if (!socket.connected) {
      setCreateMeetError('Unable to connect to server. Start backend and try again.');
      return;
    }

    setIsCreatingMeet(true);
    socket.timeout(7000).emit(
      'create-room',
      {userId, roomName, newMeetType: meetType, newMeetDate, newMeetTime},
      (err, response) => {
        setIsCreatingMeet(false);

        if (err) {
          setCreateMeetError('Create meet request timed out. Please try again.');
          return;
        }

        if (!response?.ok) {
          setCreateMeetError(response?.error || 'Could not create meet. Please try again.');
          return;
        }

        setIsCreateModalOpen(false);
        setRoomName('');
        setNewMeetType('instant');
        setNewMeetDate('none');
        setNewMeetTime('none');
        setCreateMeetError('');
      }
    );
  }

  const handleJoinRoom = async () =>{
    await socket.emit('user-code-join', {roomId: joinRoomId});
    setRoomName('');
  }

  useEffect(() =>{
    const onRoomExists = ({roomId}) => {
      navigate(`/meet/${roomId}`); 

    };

    const onRoomNotExist = () => {
      setJoinRoomId('');
      setJoinRoomError("Room dosen't exist! please try again..");
    };

    socket.emit("fetch-my-meets", {userId});
    const onMeetsFetched = async ({myMeets}) => {
      console.log("myMeetsss", myMeets)
      setMyMeets(myMeets);
    };

    socket.on("room-exists", onRoomExists);
    socket.on("room-not-exist", onRoomNotExist);
    socket.on("meets-fetched", onMeetsFetched);

    return () => {
      socket.off("room-exists", onRoomExists);
      socket.off("room-not-exist", onRoomNotExist);
      socket.off("meets-fetched", onMeetsFetched);
    };
  }, [socket, navigate, setMyMeets, userId])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!homePageRef.current) return;
      homePageRef.current.style.setProperty('--cursor-x', `${e.clientX}px`);
      homePageRef.current.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const userName = localStorage.getItem("userName") || "";


  return (
    <div className='homePage' ref={homePageRef}>
        <div className="homePage-hero">
          <div className="home-header">
              <div className="home-logo">
                <h2 >Connectra</h2>
              </div>

          {!userName || userName === 'null' ? 
          
            <div className="header-before-login">
              <button onClick={handleLogIn}>login</button>
            </div>

          :
            <div className="header-after-login">
              <Dropdown>
                <Dropdown.Toggle  id="dropdown-basic">
                  {userName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item ><Link className='dropdown-options' to='/profile'>Profile</Link></Dropdown.Item>
                  <Dropdown.Item className='dropdown-options' onClick={handleLogOut} >Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

        }
          </div>

          <div className="home-container container">

          {!userName || userName === 'null' ? 

            <div className="home-app-intro">
              {/* <span className="welcome">Welcome!!</span> */}
              <h2>Unbounded <b> Connections: </b> Elevate Your Meetings with Free, Future-Forward <b> Video Conferencing!! </b></h2>
              <p>Revolutionize your meetings with our cutting-edge, future-forward video conferencing platform. Experience seamless collaboration, crystal-clear audio, and HD video, all at <b> zero-cost..!!</b>  Elevate your virtual communication and connect without boundaries today!</p>
              <button onClick={handleLogIn}>Join Now..</button>
            </div>


          :
          <>
            <div className="home-app-intro">
                <span className="welcome">Welcome!! {userName},</span>
                <h2>Unbounded Connections: Elevate Your Meetings with Free, Future-Forward Video Conferencing!!</h2>
            </div>
            <div className="home-meet-container">
              <div className="create-meet">
                <input type="text" placeholder='Name your meet...' onChange={(e)=> setRoomName(e.target.value)}  />
                <button type="button" onClick={handleOpenCreateModal}><RiVideoAddFill/> New meet</button>
              </div>
              <p>or</p>
              <div className="join-meet">
                <input type="text" placeholder='Enter code...' onChange={(e)=> setJoinRoomId(e.target.value)} />
                <button onClick={handleJoinRoom}> <CgEnter /> Join Meet</button>
              </div>
              <span>{joinRoomError}</span>
            </div>


            {isCreateModalOpen ?
            <div className="create-meet-modal-overlay" onClick={handleCloseCreateModal}>
              <div className="create-meet-modal" role="dialog" aria-modal="true" aria-labelledby="createMeetTitle" onClick={(e) => e.stopPropagation()}>
                <div className="create-meet-modal-header">
                  <h5 id="createMeetTitle">Create New Meet</h5>
                  <button type="button" className="create-meet-close" onClick={handleCloseCreateModal} aria-label="Close">x</button>
                </div>
                <div className="create-meet-modal-body">
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInput" placeholder='Name your meet' value={roomName} onChange={(e)=> setRoomName(e.target.value)} />
                    <label htmlFor="floatingInput">Meet name</label>
                  </div>

                  <select className="form-select" aria-label="Default select example" value={newMeetType || 'instant'} onChange={(e) => setNewMeetType(e.target.value)}>
                    <option value="instant">Instant meet</option>
                    <option value="scheduled">Schedule for later</option>
                  </select>

                  {newMeetType === 'scheduled' ?
                  <>
                    <p style={{margin: "10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Date: </p>
                    <input type='date' className="form-control" onChange={(e) => setNewMeetDate(e.target.value)} />
                    <p style={{margin: "10px 0px 0px 0px", color: 'rgb(2, 34, 58)'}}>Meet Time: </p>
                    <input type='time' className="form-control" onChange={(e) => setNewMeetTime(e.target.value)} />
                  </>
                  :
                  ''}

                  {createMeetError ? <span className="create-meet-error">{createMeetError}</span> : ''}
                </div>
                <div className="create-meet-modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCreateModal}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleCreateRoom} disabled={isCreatingMeet}>{isCreatingMeet ? 'Creating...' : 'Create meet'}</button>
                </div>
              </div>
            </div>
            : ''}


            </>
  }
          

          </div>
        </div>

        <div className="about-app-container">
          <div className="box">
            <div className="box-inner">
              <div className="box-front">
                <h2>Connect Anytime, Anywhere!</h2>
                <p>Our video conference app brings people closer with easy connectivity and affordability. Experience seamless virtual meetings, collaborate effortlessly, and stay connected across the globe. Say goodbye to distance and hello to convenience!</p>
              </div> 
              <div className="box-back">
                <h2>Your Passport to Seamless Communication!</h2>
                <p>Unlock the world of effortless connectivity with our video conference app. Stay connected with colleagues, friends, and family, no matter where they are. Say goodbye to expensive travel and hello to affordable, hassle-free meetings.</p>
              </div>
            </div>
          </div>

          <div className="about-cards">
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <Groups2Icon  /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Easy Group Conference!! Bringing chaos to order, one virtual group hug at a time!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <CalendarMonthIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Schedule Meets Any Time!! Time is no longer the boss, you are!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'> <span> <CurrencyRupeeIcon/> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Free of Cost!! Saving you moolah and keeping your pockets jolly. High fives for freebies!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <StopCircleIcon/> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Preserving valuable discussions and insights, enabling you to revisit and learn from every meeting.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>
                <Card.Title className='about-card-title'><span> <QuestionAnswerIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                In-Meet Chat Feature!! Facilitating seamless communication within meetings, fostering real-time collaboration and engagement!!
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className='about-card-body' >
              <Card.Body>

                <Card.Title className='about-card-title'><span> <BoltIcon /> </span></Card.Title>
                <Card.Text className='about-card-text'>
                Zooming through virtual space like a rocket-powered cheetah. Efficiently connecting dots, one meet at a time!
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

        </div>


        <div className="footer">
          <h2>Contact us @: </h2>
          <div className="footer-social-media">
              <GoogleIcon />
              <FacebookIcon />
              <InstagramIcon />
              <TwitterIcon />
          </div>
        </div>
        
    </div>
  )
}

export default Home