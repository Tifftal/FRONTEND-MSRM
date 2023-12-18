import { FC, SetStateAction, useEffect, useState } from 'react';
import './index.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import sampleData from '../../mock/sampleMock';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { saveDraftMissionID, saveFilterType, saveSearch } from '../../reduxToolkit/toolkitSlice';
import { useSamples } from '../../features/useSamples';

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

const Samples: FC = () => {
    const draftID = useSelector((state: RootState) => state.toolkit.draftID)
    const search = useSelector((state: RootState) => state.toolkit.search)
    const rockType = useSelector((state: RootState) => state.toolkit.type)
    const dispatch = useDispatch();
    const [samples, setSamples] = useState<Sample[] | undefined>();
    const [types, setTypes] = useState<string[]>([])

    const {
        handleRadioChange,
        searchSaving,
        addToBag,
        showAlert,
    } = useSamples();


    useEffect(() => {
        axios.get(`/api/api/sample/?name=&rockType=`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                console.log(response.data)
                dispatch(saveDraftMissionID(response.data.draftMission_id))
                const samplesData = response.data.samples;
                // setSamples(samplesData);

                const uniqueTypes: any[] = []
                samplesData.map((sample: { Rock_Type: any; }) => {
                    uniqueTypes.push(sample.Rock_Type)
                })

                const uniqueTypesSet = new Set(uniqueTypes);
                const uniqueTypesArray = Array.from(uniqueTypesSet);

                setTypes(uniqueTypesArray);
            })
            .catch(error => {
                console.log('Не удалось подключиться к БД:', error);
                // setSamples(sampleData);
                const uniqueTypes: any[] = []
                sampleData.map((sample: { Rock_Type: any; }) => {
                    uniqueTypes.push(sample.Rock_Type)
                })

                const uniqueTypesSet = new Set(uniqueTypes);
                const uniqueTypesArray = Array.from(uniqueTypesSet);

                setTypes(uniqueTypesArray);
            })
    }, []);

    useEffect(() => {
        axios.get(`/api/api/sample/?name=${search}&rockType=${rockType}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            }
        )
            .then(response => {
                const samplesData = response.data.samples;
                setSamples(samplesData);
            })
            .catch(error => {
                console.log('Не удалось подключиться к БД:', error);
                const data: SetStateAction<Sample[] | undefined> = [];
                sampleData.map(sample => {
                    if (sample.Rock_Type === rockType) {
                        data.push(sample);
                    }
                    else if (rockType === '') {
                        data.push(sample);
                    }
                });
                setSamples(data);
            })
    }, [search, rockType])

    return (
        <div className='page1'>
            <h1>Образцы марсианских пород, собранные марсоходом Perseverance</h1>
            <div>Текущий DraftID: {draftID}</div>
            <p>
                Марсоход НАСА Mars Perseverance собирает уникальную коллекцию камней, в которую входят образцы грунта Марса,
                атмосфера и рыхлый поверхностный материал. Эти образцы отражают историю места приземления в кратере Джезеро, а также
                признаки древней жизни. Узнайте больше об этих драгоценных образцах, которые могут быть доставлены на Землю в рамках миссии Mars Sample Return Mission
                для детального изучения.
            </p>
            <Form className="d-flex" style={{ marginBottom: 30 }}>
                <Form.Control
                    type="search"
                    placeholder="Поиск"
                    value={search}
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => searchSaving(e)}
                />
            </Form>
            <div className='main-block'>
                <form>
                    <h5>Фильтр по типу:</h5>
                    {
                        types.map(type => (
                            <div style={{ marginBottom: '5px' }} key={type}>
                                <input
                                    type='radio'
                                    id={type}
                                    value={type}
                                    checked={rockType === `${type}`}
                                    onChange={handleRadioChange}
                                    style={{ marginRight: '7px', transform: 'scale(1.2)' }}
                                />
                                <label htmlFor={type}>{type}</label>
                            </div>
                        ))
                    }
                    <button className='DropBtn' type="button" onClick={() => dispatch(saveFilterType(""))}>
                        Сбросить
                    </button>
                </form>
                <div className='card-menu'>
                    {samples ? (
                        samples.map((sample) => (
                            <Card key={sample.Id_sample} className="card">
                                <Card.Img className='card-img' variant="top" src={sample.Image || 'coal.png'} />
                                <Card.Body>
                                    <Card.Title className='card-title'>{sample.Name}</Card.Title>
                                    <Card.Text className='text-card'>
                                        {`${sample.Type} - ${sample.Rock_Type}`}
                                    </Card.Text>
                                    <div className='btnBar'>
                                        <Button className='card-btn' variant="primary">
                                            <NavLink className="link-btn" to={`/MSRM/detail/${sample.Id_sample}`}>
                                                Узнать больше
                                            </NavLink>
                                        </Button>
                                        {window.localStorage.getItem("token") ? (
                                            <button className='bagBtn' onClick={() => addToBag(sample.Id_sample)}>
                                                <img src='bag.png' alt="Bag" />
                                            </button>
                                        ) : null}
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>Loading samples...</p>
                    )}
                </div>
            </div>
            {showAlert && (
                <Alert key="warning" variant="warning" className='alert'>
                    Образец успешно добавлен в корзину!
                </Alert>
            )}
        </div>
    );
};

export default Samples;
