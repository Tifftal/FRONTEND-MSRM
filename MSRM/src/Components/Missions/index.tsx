import { FC, useEffect, useState } from 'react';
import FilterDate from '../../shared/filter_mission';
import "./index.css"
import axios from 'axios';
import { Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Mission {
    Formation_date: string;
    Mission_status: string;
    Id_mission: number;
}

const Missions: FC = () => {
    const [names, setNames] = useState<any>([]);
    const [selectedName, setSelectedName] = useState<string>('');
    const [data, setData] = useState<Mission[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const token = window.localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : 'Guest';
    const navigate = useNavigate();

    useEffect(() => {
        const url = `/api/api/mission/`;
        axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const users = [];
                response.data.missions.forEach(mission => {
                    users.push(mission.User_name);
                });
                const uniqueUsersSet = new Set(users);
                const uniqueUsers = [...uniqueUsersSet];

                setNames(uniqueUsers)
            })
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const url = `/api/api/mission/?start_date=${startDate}&end_date=${endDate}&mission_status=${status}`;
            try {
                const response = await axios.get(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                        },
                    }
                );

                if (selectedName !== '') {
                    const filteredMissions = response.data.missions.filter(mission => mission.User_name === selectedName);
                    setData(filteredMissions);
                } else {
                    setData(response.data.missions);
                }

                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Вызываем fetchData при монтировании компонента
        fetchData();

        // Устанавливаем интервал для short polling каждые 5 секунд
        const intervalId = setInterval(fetchData, 5000);

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [startDate, endDate, status, selectedName]);


    const UpdateData = () => {
        const url = `/api/api/mission/?start_date=${startDate}&end_date=${endDate}`;
        axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                setData(response.data.missions);
                console.log(response.data);
            })
    }

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };

        const formattedDate = new Date(dateString).toLocaleDateString('ru-RU', options);
        return `${formattedDate}`;
    };

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

    const handleStatusChange = (event: any) => {
        const status = event.target.value;
        setStatus(status);
    };

    const handleNameChange = (event: any) => {
        const name = event.target.value;
        setSelectedName(name);
    };

    return (
        <div className='missions'>
            <div>
                {
                    decodedToken.role === "Moderator" ?
                        <div className='filter-mission' style={{ marginBottom: "5%" }}>
                            <h1>Фильтр по заказчику</h1>
                            <div className='filter-input'>
                                <Form.Select
                                    aria-label="Default select example"
                                    value={selectedName}
                                    onChange={handleNameChange}
                                >
                                    <option value="">Все</option>
                                    {
                                        names.map(name => (
                                            <option value={name}>{name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </div>
                        </div>
                        : null
                }
                <div className='filter-mission' style={{ marginBottom: "5%" }}>
                    <h1>Фильтр по статусу заказа</h1>
                    <div className='filter-input'>
                        <Form.Select
                            aria-label="Default select example"
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="">Все миссии</option>
                            <option value="Awaiting confirmation">Ожидает подтверждения</option>
                            <option value="At work">В работе</option>
                            <option value="Rejected">Отменен</option>
                            <option value="Completed">Завершен</option>
                        </Form.Select>
                    </div>
                </div>

                <FilterDate
                    onStartDateChange={(date) => setStartDate(date)}
                    onEndDateChange={(date) => setEndDate(date)}
                />
            </div>
            <div className='list'>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}></th>
                            <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>№</th>
                            {/* <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>Дата создания</th> */}
                            <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>Дата формирования</th>
                            <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>Дата завершения</th>
                            {
                                decodedToken.role === "Moderator" ?
                                    <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>Заказчик</th>
                                    : null
                            }
                            <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}>Статус</th>
                            {
                                decodedToken.role === "Moderator" ?
                                    <th style={{ backgroundColor: "rgba(13, 109, 253, 0.5)" }}></th>
                                    : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((mission, index) => (
                                mission.Mission_status !== "Draft" && mission.Mission_status !== "Deleted" ? (
                                    <tr>
                                        <td><a href={`/MSRM/mission/detail/${mission.Id_mission}`} className='more-btn'><img src='./icons8-удивление-64.png' /></a></td>
                                        <td>{mission.Id_mission}</td>
                                        {/* <td>{formatDate(mission.Creation_date)}</td> */}
                                        <td>{formatDate(mission.Formation_date)}</td>
                                        {
                                            mission.Completion_date !== null ?
                                                <td>{formatDate(mission.Completion_date)}</td>
                                                : <td>-</td>
                                        }
                                        {
                                            decodedToken.role === "Moderator" ?
                                                <td>{mission?.User_name}</td>
                                                : null
                                        }
                                        {
                                            mission.Mission_status === "Awaiting confirmation" ?
                                                <td style={{ color: "rgb(240, 190, 100)" }}>Ожидает подтверждения</td>
                                                : mission.Mission_status === "Completed" ?
                                                    <td style={{ color: "rgb(27, 130, 32)" }}>Завершен</td>
                                                    : mission.Mission_status === "At work" ?
                                                        <td style={{ color: "#0d6efd" }}>В работе</td>
                                                        : mission.Mission_status === "Rejected" ?
                                                            <td style={{ color: "rgb(211, 57, 57)" }}>Отклонен</td>
                                                            : null
                                        }
                                        {
                                            decodedToken.role === "Moderator" ?
                                                <td>
                                                    {
                                                        mission.Mission_status === "Awaiting confirmation" ? <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between', alignItems: "center" }}><button className='submit-btn' onClick={() => { UpdateStatus(mission.Id_mission, "At work") }}>Подтвердить</button><button className='reject-btn' onClick={() => { UpdateStatus(mission.Id_mission, "Rejected") }}>Отклонить</button></div> : mission.Mission_status === "At work" ? <button className='complete-btn' onClick={() => { UpdateStatus(mission.Id_mission, "Completed") }}>Завершить</button> : null
                                                    }
                                                </td>
                                                : null
                                        }
                                    </tr>
                                ) : null
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div >
    );
}

export default Missions;
