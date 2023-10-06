import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const Nav = () => {
    const [current,setCurrent] = useState('');
    const [selectedTab,setSelectedTab] = useState('Login');
    const [state,setState] = useContext(UserContext);

    useEffect(()=> {
        process.browser && setCurrent(window.location.pathname) 
    },[process.browser && window.location.pathname])

    console.log('current:',current);

    const router = useRouter();
    const logOut = ()=> {
        window.localStorage.removeItem('auth');
        setState(null);
        router.push('/login')
    };
    

    return (
        <nav className="nav d-flex justify-content-between" style={{ backgroundColor: 'skyblue' }}>
            <Link className={`nav-link text-light${current == '/' ? 'active' : ''}`} href="/">
                <Avatar src="/images/react.png" />MernProject
            </Link>
            {state == null ?
                <div key={selectedTab.length} className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {!state?.user?.name && selectedTab}
                    </button>
                    <ul className="dropdown-menu text-light">
                        <li>
                            <Link 
                                className={`nav-link text-dark${current == '/login' ? 'active' : ''}`} 
                                onClick={ ()=>{
                                    console.log('dropdown',current);
                                    setSelectedTab('Login')
                                } } 
                                href="/login"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link 
                                className={`nav-link text-dark${current == '/register' ? 'active' : ''}`} 
                                onClick={
                                    ()=>{
                                        console.log('dropdown',current);
                                        setSelectedTab('Register')
                                    }
                                }
                                href="/register">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
                : <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {state?.user?.name}
                    </button>
                    <ul className="dropdown-menu text-light">
                        <li>
                            <Link className={`nav-link text-dark${current == '/user/profile/update' ? 'active' : ''}`} href="/user/profile/update">Profile
                            </Link>
                        </li>
                        <li>
                            <Link className={`nav-link text-dark${current == '/user/dashboard' ? 'active' : ''}`} href="/user/dashboard">Dashboard
                            </Link>
                        </li>
                        <li>
                            <button onClick={logOut} className="nav-link text-dark">Log Out</button>
                        </li>
                    </ul>
                </div>
            }
        </nav>
    )
}

export default Nav;