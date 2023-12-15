import { FC, useEffect, useState } from 'react';
import "./index.css"
import BagPrice from '../../widgets/bagPrice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { Alert } from 'react-bootstrap';
import { useBag } from '../../features/useBag';

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
    const draftID = useSelector((state: RootState) => state.toolkit.draftID);

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
            `/api/api/mission/${draftID}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const samples = response.data.samples
                setData(samples);
                console.log(response);
                setCount(samples.length);
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    return (
        <div className='bag'>
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
            <BagPrice count={count} />
            {showAlert && (
                <Alert key="danger" variant="danger" className='alert'>
                    Образец успешно удален!
                </Alert>
            )}
        </div>
    );
}

export default Bag;