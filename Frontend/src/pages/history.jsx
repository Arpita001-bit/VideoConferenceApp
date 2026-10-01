import  React from 'react'
import { useContext } from 'react'
import { AuthConext } from '../contexts/Authentication'
import { useNavigate } from 'react-router-dom';

export default function History(){

    const {getHistoryOfUser} = useContext(AuthConext);

    const [meetings , setMeetings] = useState([])
    const routeTo = useNavigate();

    useEffect(()=>{
        const fetchHistory = async()=>{
            try{

                const  history = await getHistoryOfUser();
                setMeetings(history);
            }catch{

            }
        }
        fetchHistory();

    },[]);

    return (
        <div>
           {
            meetings.map(e=>{
                return(
                    <>
                    < Card variant="outlined"></Card>
                    </>
                )
            })
           }
        </div>
    )


}