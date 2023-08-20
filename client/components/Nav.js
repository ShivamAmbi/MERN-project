import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Nav = () => {
    const [current,setCurrent] = useState('');
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
                MernProject
            </Link>
            {state == null ?
                <>
                    <Link className={`nav-link text-light${current == '/login' ? 'active' : ''}`} href="/login">
                        Login
                    </Link>
                    <Link className={`nav-link text-light${current == '/register' ? 'active' : ''}`} href="/register">
                        Register
                    </Link>
                </>
                : <div style={{display:'flex'}}>
                    <Link className={`nav-link text-light${current == '/user/dashboard' ? 'active' : ''}`} href="/user/dashboard">{state?.user?.name}</Link>
                    <button onClick={logOut} className="nav-link text-light">Log Out</button>
                </div>
            }
        </nav>
    )
}

export default Nav;