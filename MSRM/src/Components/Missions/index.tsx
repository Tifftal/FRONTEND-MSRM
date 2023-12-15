import { FC, useEffect, useState } from 'react';
import MissionList from '../../widgets/missions_list';
import FilterDate from '../../shared/filter_mission';
import "./index.css"
import axios from 'axios';

// Define the type for your mission data
interface Mission {
    Formation_date: string;
    Mission_status: string;
    Id_mission: number;
    // Add other properties as needed
}

const Missions: FC = () => {
    const [data, setData] = useState<Mission[]>([]);

    useEffect(() => {
        axios.get(
            `/api/api/mission/`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
        .then(response => {
            setData(response.data);
            console.log(response);
        })
    }, [])

    return (
        <div className='missions'>
            <FilterDate />
            <div className='list'>
                {
                    data.map((mission, index) => (
                        <MissionList
                            key={index}
                            dateFormation={mission.Formation_date}
                            status={mission.Mission_status}
                            ID={mission.Id_mission}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Missions;
