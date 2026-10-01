// import React, { useState } from 'react';
// import CssBaseline from '@mui/material/CssBaseline';
// import Stack from '@mui/material/Stack';
// import AppTheme from '../shared-theme/AppTheme';
// import ColorModeSelect from '../shared-theme/ColorModeSelect';
// import SignInCard from './components/SignInCard';
// import Content from './components/Content';
// import { Button, Snackbar } from '@mui/material';
// import { AuthConext } from '../contexts/Authentication';

// export default function Authentication(props) {
//   const [username, setUsername] = useState();   
//   const [password, setPassword] = useState();
//   const [name, setName] = useState();
//   const [error, setError] = useState();
//   const [message , setMessage] = useState();



//   const [ formState , setFormState] = useState(0);
//   const [ open,setOpen] = useState(false)

  

//   const { handleRegister, handleLogin } = React.useContext(AuthConext);

// let handleAuth = async ({ name, username, password }) => {
//   try {
//     if (formState == 0) {
//       let result = await handleLogin(username, password);
//       console.log(result);
//        setMessage(result);
//       setOpen(true);
//       navigate("/home"); 
//     }
//     if (formState == 1) {

//       let result = await handleRegister(name, username, password);
//       console.log(result);
//       setMessage(result);
//       setOpen(true);
//       navigate("/home"); 
//     }
//   } catch (error) {
   
//     let message = error.response?.data?.message || 'Something went wrong';
//     setError(message);
//   }
// }

//   return (
//     <AppTheme {...props}>
//       <CssBaseline enableColorScheme />
//       <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
     
//       <Stack
//         direction="column"
//         component="main"
//         sx={[
//           {
//             justifyContent: 'center',
//             height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
//             marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
//             minHeight: '100%',
//           },
//           (theme) => ({
//             '&::before': {
//               content: '""',
//               display: 'block',
//               position: 'absolute',
//               zIndex: -1,
//               inset: 0,
//               backgroundImage:
//                 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//               backgroundRepeat: 'no-repeat',
//               ...theme.applyStyles('dark', {
//                 backgroundImage:
//                   'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//               }),
//             },
//           }),
//         ]}
//       >
//         <Stack
//           direction={{ xs: 'column-reverse', md: 'row' }}
//           sx={{
//             justifyContent: 'center',
//             gap: { xs: 6, sm: 12 },
//             p: 2,
//             mx: 'auto',
//           }}

          
//         >
           
//           <Stack
//             direction={{ xs: 'column-reverse', md: 'row' }}
//             sx={{
//               justifyContent: 'center',
//               gap: { xs: 6, sm: 12 },
//               p: { xs: 2, sm: 4 },
//               m: 'auto',
//             }}
//           >
//             <Snackbar open={open} 
//             autoHideDuration={4000}
//             message={message}>
              
//             </Snackbar>

//             <Content />
            
//             {/* <SignInCard/> */}

// <SignInCard
//   username={username}
//   setUsername={setUsername}
//   password={password}
//   setPassword={setPassword}
//   formState={formState}
//   setFormState={setFormState}
//   handleAuth={handleAuth}
//   error={error}
// />
//           </Stack>
          
//         </Stack>
//       </Stack>
//     </AppTheme>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { Snackbar } from '@mui/material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import SignInCard from './components/SignInCard';
import Content from './components/Content';
import { AuthConext } from '../contexts/Authentication';

export default function Authentication(props) {
  const navigate = useNavigate();                  

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState(0);   
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthConext);

 
  const handleAuth = async (creds) => {
    const data = creds || { name, username, password };
    setError("");                                  

    try {
      if (formState === 0) {
        const result = await handleLogin(data.username, data.password);
        setMessage(result);
        setOpen(true);
        navigate("/home");
      } else {
        const result = await handleRegister(data.name, data.username, data.password);
        setMessage(result);
        setOpen(true);
        setFormState(0);                           
      }
    } catch (err) {
      console.error(err);                         
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />

      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: 'center',
            height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
            marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
            minHeight: '100%',
          },
          (theme) => ({
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundImage:
                'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
              backgroundRepeat: 'no-repeat',
              ...theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }),
        ]}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: 'auto',
          }}
        >
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => setOpen(false)}        
            message={message}
          />

          <Content />

          <SignInCard
            name={name}
            setName={setName}                      
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            formState={formState}
            setFormState={setFormState}
            handleAuth={handleAuth}
            error={error}
          />
        </Stack>
      </Stack>
    </AppTheme>
  );
}