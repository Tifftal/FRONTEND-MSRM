import { FC, useEffect, useState } from 'react';
import "./index.css"
import BagPrice from '../../widgets/bagPrice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { Alert, Button, Card } from 'react-bootstrap';
import { useBag } from '../../features/useBag';
import { NavLink, useParams } from 'react-router-dom';

interface Sample {
    Id_sample: number;
    Name: string;
    Type: string;
    Date_Sealed: string;
    Sol_Sealed: number;
    Rock_Type: string;
    Height: string;
    Current_Location: string;
    Image: string;
    Video: string;
    Sample_status: string;
}

const Bag: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [mission, setMission] = useState();
    const [user, setUser] = useState();

    const token = window.localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : 'Guest';

    const {
        RemoveSample,
        data,
        setData,
        count,
        setCount,
        showAlert
    } = useBag();

    useEffect(() => {
        axios.get(
            `/api/api/mission/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const samples = response.data.samples;
                setMission(response.data.mission);
                setData(samples);
                console.log(response.data);
                setCount(samples.length);
                axios.get(`/api/user/${response.data.mission.User_id}`)
                    .then(response => {
                        console.log(response.data)
                        setUser(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const UpdateData = () => {
        axios.get(
            `/api/api/mission/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const samples = response.data.samples;
                setMission(response.data.mission);
                setData(samples);
                console.log(response.data);
                setCount(samples.length);
                axios.get(`/api/user/${response.data.mission.User_id}`)
                    .then(response => {
                        console.log(response.data)
                        setUser(response.data)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }

    const UpdateStatus = (id: number, status: string) => {
        axios.put(`/api/api/mission/status_by_moderator/${id}`,
            {
                "Mission_status": status,
            },
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
            .then(response => {
                console.log(status);
                console.log(response);
                UpdateData();
            })
            .catch(error => {
                console.log(status);
                console.log(error)
            })
    }

    return (
        <div>
            {
                mission?.Mission_status !== "Draft" ?
                    <div className='bread-bar'>
                        <NavLink to="/MSRM/" className='bread' style={{ marginLeft: 30 }}>Главная / </NavLink>
                        <NavLink to="/MSRM/missions" className='bread'>Миссии / </NavLink>
                        <NavLink to="#" className='bread-active'>{`Миссия №${mission?.Id_mission}`}</NavLink>
                    </div>
                    : null
            }
            <div className='bag'>
                {
                    mission?.Mission_status === "Draft" ?
                        <div className='goods'>
                            {
                                data.map((sample, index) => (
                                    <div className='good-card' key={index}>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <img src={sample.Image || 'coal.png'} />
                                            <div className='good-card-info'>
                                                <h1>{sample.Name}</h1>
                                                <h2>{`${sample.Type} - ${sample.Rock_Type}`}</h2>
                                            </div>
                                        </div>
                                        <button onClick={() => RemoveSample(sample.Id_sample)}>Удалить</button>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div className='goods'>
                            {
                                data.map((sample, index) => (
                                    <div className='good-card' key={index}>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <img src={sample.Image || 'coal.png'} />
                                            <div className='good-card-info'>
                                                <h1>{sample.Name}</h1>
                                                <h2>{`${sample.Type} - ${sample.Rock_Type}`}</h2>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                }
                {
                    mission?.Mission_status === "Draft" ?
                        <BagPrice count={count} />
                        :
                        <div className='bag-price'>
                            <Card style={{ margin: 0 }}>
                                <Card.Body>
                                    <Card.Title className='title-price'>Информация о заказе</Card.Title>
                                    <Card.Text>
                                        <div className='list-bag' style={{ margin: 0, padding: 0, marginTop: 20, fontWeight: 600 }}>
                                            <p style={{ margin: 0, padding: 0, marginBottom: 5 }}>Заказчик</p>
                                        </div>
                                        <div className='list-bag' style={{ margin: 0, padding: 0, marginTop: 5 }}>
                                            <p style={{ margin: 0, padding: 0 }}>Имя</p>
                                            <p style={{ margin: 0, padding: 0 }}>{user?.Name}</p>
                                        </div>
                                        <div className='list-bag' style={{ margin: 0, padding: 0, marginTop: 5 }}>
                                            <p style={{ margin: 0, padding: 0 }}>Номер телефона</p>
                                            <p style={{ margin: 0, padding: 0 }}>{user?.Phone_number}</p>
                                        </div>
                                        <div className='list-bag' style={{ margin: 0, padding: 0, marginTop: 5 }}>
                                            <p style={{ margin: 0, padding: 0 }}>Email</p>
                                            <p style={{ margin: 0, padding: 0 }}>{user?.Email_address}</p>
                                        </div>
                                        <div className='list-bag'>
                                            <p style={{ fontWeight: 600 }}>Кол-во образцов</p>
                                            <p>{count} шт</p>
                                        </div>
                                        <div className='list-bag'>
                                            <p style={{ fontWeight: 600 }}>Статус</p>
                                            {
                                                mission?.Mission_status === "Awaiting confirmation" ?
                                                    <p style={{ color: "rgb(241, 201, 0)" }}>Ожидает подтверждения</p> :
                                                    mission?.Mission_status === "At work" ?
                                                        <p style={{ color: "#0d6efd" }}>В работе</p> :
                                                        mission?.Mission_status === "Completed" ?
                                                            <p style={{ color: "rgb(31, 141, 37)" }}>Завершен</p> :
                                                            mission?.Mission_status === "Rejected" ?
                                                                <p style={{ color: "rgb(211, 57, 57)" }}>Отменен</p> :
                                                                null
                                            }
                                        </div>
                                    </Card.Text>
                                    {
                                        decodedToken.role === "Moderator" &&
                                            mission?.Mission_status === "Awaiting confirmation" ?
                                            <div className='priceBtn'>
                                                <button className='submit-btn' onClick={() => { UpdateStatus(mission.Id_mission, "At work") }}>Подтвердить</button>
                                                <button className='reject-btn' onClick={() => { UpdateStatus(mission.Id_mission, "Rejected") }}>Отклонить</button>
                                            </div> :
                                            decodedToken.role === "Moderator" && mission?.Mission_status === "At work" ?
                                                <div className='priceBtn'>
                                                    <button className='complete-btn' onClick={() => { UpdateStatus(mission.Id_mission, "Completed") }}>Завершить</button>
                                                </div> :
                                                null
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                }

                {showAlert && (
                    <Alert key="danger" variant="danger" className='alert'>
                        Образец успешно удален!
                    </Alert>
                )}
            </div>
        </div>
    );
}

export default Bag;