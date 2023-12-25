import { FC, SetStateAction, useEffect, useState } from 'react';
import './index.css';
import { NavLink, useNavigate } from 'react-router-dom';
import sampleData from '../../mock/sampleMock';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { saveDraftMissionID, saveFilterType, saveSearch } from '../../reduxToolkit/toolkitSlice';
import moment from 'moment';
import { Button, Form, Modal } from 'react-bootstrap';

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

const SampleMod: FC = () => {
    const draftID = useSelector((state: RootState) => state.toolkit.draftID)
    const search = useSelector((state: RootState) => state.toolkit.search)
    const rockType = useSelector((state: RootState) => state.toolkit.type)
    const dispatch = useDispatch();
    const [samples, setSamples] = useState<Sample[] | undefined>();
    const [types, setTypes] = useState<string[]>([])
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [selectedID, setSelected] = useState<number>(0);
    const [fileImg, setImg] = useState<File | null>(null);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedRockType, setSelectedRockType] = useState<string>('');

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        setImg(file);
        console.log(file)
    };

    const handleClose = () => setShow(false);
    const handleShow = (id: any) => {
        setSelected(id);
        setShow(true)
    };


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
    }, [search, rockType]);

    const UpdateData = () => {
        axios.get(`/api/api/sample/?name=${search}&rockType=${rockType}`, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
        })
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
                    } else if (rockType === '') {
                        data.push(sample);
                    }
                });
                setSamples(data);
            });
    };


    const DeleteSample = (id: any) => {
        axios.delete(`/api/api/sample/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
            .then(response => {
                console.log(response);
                UpdateData();
            }
            )
            .catch(error => {
                console.log(error)
            })
    }

    const AddImage = (sampleId: number) => {
        if (fileImg) {
            const formData = new FormData();
            formData.append('image', fileImg);
            axios.post(`/api/api/sample/${sampleId}/image`, formData, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(response => {
                    console.log(response);
                    handleClose();
                    UpdateData();
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const searchSaving = (e: any) => {
        setSearchQuery(e.target.value);
        dispatch(saveSearch(e.target.value));
    }
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRockType(event.target.value);
        dispatch(saveFilterType(event.target.value));
    };

    return (
        <div className='page-sample-mod'>
            <h1>Образцы марсианских пород, собранные марсоходом Perseverance</h1>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ width: "50%", marginRight: "5%" }}>
                    <Form className="d-flex" style={{ marginBottom: 20, width: "100%" }}>
                        <Form.Control
                            type="search"
                            placeholder="Поиск"
                            value={search}
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => searchSaving(e)}
                        />
                    </Form>
                    <form style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 0, padding: 0, marginBottom: "2%", alignItems: "center" }}>
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
                        <button className='drop-filter-btn' type="button" onClick={() => dispatch(saveFilterType(""))}>
                            Сбросить
                        </button>
                    </form>
                </div>
                <NavLink to="/MSRM/admin/edit_sample/0"><button className='add-sample-btn'>Добавить образец</button></NavLink>
            </div>
            <table className='sample-table'>
                <thead>
                    <tr>
                        <th></th>
                        <th>№</th>
                        <th>Название</th>
                        <th>Изображение</th>
                        <th>Тип</th>
                        <th>Тип камня</th>
                        <th>Высота</th>
                        <th>Местоположение</th>
                        <th>Дата сбора</th>
                        <th>Кол-во</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        samples ? (
                            samples.map((sample) => (
                                <tr>
                                    <td className='edit-btn' style={{ textAlign: "center" }}><button onClick={() => { navigate(`/MSRM/admin/edit_sample/${sample.Id_sample}`) }}><img src='../icons8-редактировать-96.png' /></button></td>
                                    <td>{sample.Id_sample}</td>
                                    <td>{sample.Name}</td>
                                    <td className='img-table'><img src={`${sample.Image}`} /><button onClick={() => { handleShow(sample.Id_sample) }}>Изменить</button></td>
                                    <td>{sample.Type}</td>
                                    <td>{sample.Rock_Type}</td>
                                    <td>{sample.Height}</td>
                                    <td>{sample.Current_Location}</td>
                                    <td>{moment((sample.Date_Sealed)).format("L")}</td>
                                    <td>{sample.Sol_Sealed}</td>
                                    <td className='delete-btn' style={{ textAlign: "center" }}><button onClick={() => { DeleteSample(sample.Id_sample) }}><img src='../icons8-крестик-78.png' /></button></td>
                                </tr>
                            ))
                        ) : (
                            <p>Loading samples...</p>
                        )}
                </tbody>

            </table>
            <Modal show={show} onHide={handleClose} selectedID={selectedID}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить изображение образца № {selectedID}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Новое изображение</Form.Label>
                            <Form.Control
                                type="file"
                                autoFocus
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={() => { AddImage(selectedID) }}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SampleMod;
