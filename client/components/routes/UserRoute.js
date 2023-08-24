import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {SyncOutlined} from '@ant-design/icons'
import { UserContext } from "../../context";

const UserRoute = ({children}) => {
    const [ok,setok] = useState(false);
    const router = useRouter();
    const [state,setState] = useContext(UserContext);
    useEffect(()=>{
        if (state && state.token) getCurrentUser();
    },[state && state.token])

    const getCurrentUser = async () => {
        try {
            const {data} =  await axios.get('/current-user');
            if(data.ok) setok(true);
        } catch (error) {
            router.push('/login')
        }
    };

    process.browser && state === null && setTimeout(() => {
        getCurrentUser();
    }, 1000);
    
    return !ok ? (<SyncOutlined 
        spin 
        className="d-block justify-content center display-1 text-primary p-5"
        />
        ) : (
            <>{children}</>
        )
};

export default UserRoute;
