import { FC, useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './index.css';
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

const Detail: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [sample, setSample] = useState<Sample>();
    const navigate = useNavigate();

    const getSampleById = async (id: string | undefined): Promise<Sample | null> => {
        try {
            const response = await fetch(`http://localhost:8080/api/sample/${id}`);

            if (!response.ok) {
                console.error('Ошибка при получении данных с сервера:', response.statusText);
                return null;
            }

            const responseData = await response.json();

            return responseData;
        } catch (error) {
            console.error('Не удалось подключиться к БД:', error);
            const sampleFromData = sampleData.find((sample) => sample.Id_sample.toString() === id);
            return sampleFromData || null;
        }
    };

    const [samples, setSamples] = useState<Sample[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/sample/`);
                const samplesData = await response.json();
                console.log(samplesData);
                setSamples(samplesData);
            } catch (error) {
                console.error('Не удалось подключиться к БД:', error);
                setSamples(sampleData);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchSample = async () => {
            const realSample = await getSampleById(id);

            if (realSample) {
                setSample(realSample);
            } else {
                console.error('Не удалось получить данные о образце');
            }
        };

        fetchSample();
    }, [id]);

    const getCurrentIndex = () => {
        return samples?.findIndex((sample) => sample.Id_sample.toString() === id);
    };

    const handleNext = () => {
        const currentIndex = getCurrentIndex();
        if (currentIndex != undefined) {
            const nextIndex = currentIndex + 1;
            if (nextIndex < samples.length) {
                navigate(`/MSRM/detail/${samples[nextIndex].Id_sample}`);
            }
        }
    };

    const handlePrev = () => {
        const currentIndex = getCurrentIndex();
        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
            navigate(`/MSRM/detail/${samples[prevIndex].Id_sample}`);
        }
    };

    if (!sample) {
        return <p>Loading sample details...</p>;
    }

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };

        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return `Дата сбора: ${formattedDate}`;
    };

    return (
        <div className='detail_page' style={{ paddingTop: 30, paddingBottom: 30 }}>
            <NavLink to="/MSRM/" className='bread' style={{ marginLeft: 30 }}>Главная / </NavLink>
            <NavLink to="/MSRM/samples" className='bread'>Образцы / </NavLink>
            <NavLink to="#" className='bread-active'>{sample.Name}</NavLink>

            <div className='detail'>
                <Button variant="primary" onClick={handlePrev}>
                    Назад
                </Button>
                <Card className='card-det'>
                    <Card.Header className='header-det'>
                        <img src={sample.Image || '../coal.png'} alt={sample.Name} />
                    </Card.Header>
                    <Card.Body className='det'>
                        <div>
                            <Card.Title className='title-det'>{sample.Name}</Card.Title>
                            <Card.Text className='text-det'>
                                {`Тип: ${sample.Type}`} <br />
                                {`Тип камня: ${sample.Rock_Type}`} <br />
                                {`Высота: ${sample.Height}`} <br />
                                {`Текущее местоположение: ${sample.Current_Location}`} <br />
                                {formatDate(sample.Date_Sealed)} <br />
                                {`Количество собранного материала: ${sample.Sol_Sealed}`} <br />
                            </Card.Text>
                        </div>
                        <button className='bagBtn-det'><img src='../bag.png' /> Добавить в корзину</button>
                    </Card.Body>
                </Card>
                <Button variant="primary" onClick={handleNext}>
                    Вперед
                </Button>
            </div>
        </div>
    );
};

export default Detail;
