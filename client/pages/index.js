import { useContext } from "react";
import { UserContext, UserProvider } from "../context";


const Home = () => {
    const [state,setState] = useContext(UserContext)
    return (
        <div className="container">
            <div className="row">
                <div className="col bg-home-image">
                    <h1 className="display-1 text-center py-5"> Home Page</h1>
                    {JSON.stringify(state)}
                    <img src="/images/pedestrians.jpg" alt="image"/>
                </div>
            </div>
        </div>
    )
}

export default Home;