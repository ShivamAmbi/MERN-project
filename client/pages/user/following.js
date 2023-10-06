import { useContext, useEffect, useState } from "react"
import { Avatar, List } from "antd"
import moment from "moment"
import { useRouter } from "next/router"
import { UserContext } from "../../context"
import axios from "axios"
import { RollbackOutlined } from '@ant-design/icons'
import Link from "next/link";
import { toast } from "react-toastify"

const Following = () => {

    const [state, setState] = useContext(UserContext);
    const [people, setPeople] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if (state && state.token) fetchFollowing()
    }, [state && state.token])

    const imageSource = (item) => {
        if (item.image) {
            return item.image.url
        } else {
            return '/images/default-profile.jpg';
        }
    }

    const handleUnfollow = async (user) => {
        try {
            const { data } = await axios.put('/user-unfollow',{ _id: user._id });
            let auth = JSON.parse(localStorage.getItem('auth'));
            if(data) auth.user = data;
            localStorage.setItem('auth',JSON.stringify(auth));
            //update-context
            setState({ ...state, user:data });
            let filtered = people.filter((e)=> e._id != user._id);
            setPeople(filtered);
            toast.error(`Unfollowed ${user.name}`);
            if(people.length <=1 ) router.push('/user/dashboard')
        } catch (error) {
            console.log('error:', error);
        }
    }

    const fetchFollowing = async () => {
        try {
            const { data } = await axios.get('/user-following');
            setPeople(data);
        } catch (error) {
            console.log('error:', error);
        }
    }

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={people}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={imageSource(item)} />}
                            title={<div className="d-flex justify-content-between">
                                {item.name}
                                <span className="text-primary pointer" onClick={() => handleUnfollow(item)} >Unfollow</span>
                            </div>}
                            description={
                                <div>{item.about}</div>
                            }
                            key={index}
                        />
                    </List.Item>
                )}
            />
            <Link className='d-flex justify-content-center h4' href={'/user/dashboard'}><RollbackOutlined/></Link>
        </>
    )

};

export default Following;