import { FC, SetStateAction, useEffect, useState } from 'react';
import './index.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import sampleData from '../../mock/sampleMock';

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
    const [samples, setSamples] = useState<Sample[] | undefined>();
    const [types, setTypes] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedRockType, setSelectedRockType] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/sample/?name=&rockType=`);
                const samplesData = await response.json();

                const uniqueTypes = Array.from(new Set((samplesData as any[]).map((sample: any) => sample.Rock_Type as string)));
                setTypes(uniqueTypes);

            } catch (error) {
                console.error('Не удалось подключиться к БД:', error);
                setSamples(sampleData);
                const uniqueTypes = Array.from(new Set((sampleData as any[]).map((sample: any) => sample.Rock_Type as string)));
                setTypes(uniqueTypes);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/sample/?name=${searchQuery}&rockType=${selectedRockType}`);
                const samplesData = await response.json();
                setSamples(samplesData);

            } catch (error) {
                console.error('Не удалось подключиться к БД:', error);
                const data: SetStateAction<Sample[] | undefined> = [];
                sampleData.map(sample => {
                    if (sample.Rock_Type === selectedRockType) {
                        data.push(sample);
                    }
                    else if (selectedRockType === '') {
                        data.push(sample);
                    }
                });
                setSamples(data);
            }
        };

        fetchData();
    }, [searchQuery, selectedRockType]);


    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRockType(event.target.value);
    };

    return (
        <div className='page1'>
            <h1>Образцы марсианских пород, собранные марсоходом Perseverance</h1>
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
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form>
            <div className='main-block'>
                <form>
                    <h5>Фильтр по типу:</h5>
                    {
                        types.map(type => (
                            <div style={{ marginBottom: '5px' }}>
                                <input
                                    type='radio'
                                    id={type}
                                    value={type}
                                    checked={selectedRockType === `${type}`}
                                    onChange={handleRadioChange}
                                    style={{ marginRight: '7px', transform: 'scale(1.2)' }}
                                />
                                <label htmlFor={type}>{type}</label>
                            </div>
                        ))
                    }
                    <button className='DropBtn' type="button" onClick={() => setSelectedRockType('')}>
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
                                            <NavLink className="link-btn" to={`/FRONTEND-MSRM/detail/${sample.Id_sample}`}>
                                                Узнать больше
                                            </NavLink>
                                        </Button>
                                        {/* <button className='bagBtn'><img src='bag.png' /></button> */}
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>Loading samples...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Samples;
