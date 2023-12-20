import { FC, useEffect, useState } from 'react';
import MissionList from '../../widgets/missions_list';
import FilterDate from '../../shared/filter_mission';
import "./index.css"
import axios from 'axios';
import { Table } from 'react-bootstrap';

interface Mission {
    Formation_date: string;
    Mission_status: string;
    Id_mission: number;
}

const Missions: FC = () => {
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<Mission[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
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
                setName(response.data.user_name);
                console.log(response.data);
            })
    }, [startDate, endDate]);

    return (
        <div className='missions'>
            <FilterDate
                onStartDateChange={(date) => setStartDate(date)}
                onEndDateChange={(date) => setEndDate(date)}
            />
            <div className='list'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{backgroundColor: "rgba(13, 109, 253, 0.5)"}}>№</th>
                            <th style={{backgroundColor: "rgba(13, 109, 253, 0.5)"}}>Дата заказа</th>
                            <th style={{backgroundColor: "rgba(13, 109, 253, 0.5)"}}>Имя</th>
                            <th style={{backgroundColor: "rgba(13, 109, 253, 0.5)"}}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((mission, index) => (
                                mission.Mission_status !== "Draft" && mission.Mission_status !== "Deleted" ? (
                                    <MissionList
                                        key={index}
                                        dateFormation={mission.Formation_date}
                                        status={mission.Mission_status}
                                        ID={mission.Id_mission}
                                        name={name}
                                    />
                                ) : null
                            ))
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Missions;
