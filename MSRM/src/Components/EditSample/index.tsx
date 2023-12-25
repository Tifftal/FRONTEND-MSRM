import { ChangeEvent, FC, useEffect, useState } from 'react';
import './index.css';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

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

const EditSample: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editedSample, setEditedSample] = useState<Sample>({
        Id_sample: 0,
        Name: '',
        Type: '',
        Date_Sealed: '',
        Sol_Sealed: 0,
        Rock_Type: '',
        Height: '',
        Current_Location: '',
        Image: '',
        Video: '',
        Sample_status: '',
    });
    const [data, setData] = useState<Sample>()
    const [fileImg, setImg] = useState<File | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedSample((prev) => ({ ...prev, [name]: value } as Sample));
    };

    const handleInputChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value } as Sample));
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        setImg(file);
        console.log(file)
    };

    useEffect(() => {
        if (Number(id) !== 0) {
            axios.get(`/api/api/sample/${id}`, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
                .then(response => {
                    console.log(response.data);
                    setData(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [id]);


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
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const AddSample = () => {
        const formattedDate = moment(editedSample.Date_Sealed).format("YYYY-MM-DDTHH:mm:ss[Z]");
        axios.post(`/api/api/sample/create`,
            {
                Name: editedSample.Name,
                Type: editedSample.Type,
                Date_Sealed: formattedDate,
                Sol_Sealed: Number(editedSample.Sol_Sealed),
                Rock_Type: editedSample.Rock_Type,
                Height: editedSample.Height,
                Current_Location: editedSample.Current_Location,
                Image: "",
                Video: "",
                Sample_status: "Active",
            },
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
            .then(response => {
                console.log(response);
                AddImage(response.data.id);
                navigate("/MSRM/admin/samples");
            }
            )
            .catch(error => {
                console.log(error)
            })
    }

    const EditSample = () => {
        const formattedDate = moment(data?.Date_Sealed).format("YYYY-MM-DDTHH:mm:ss[Z]");
        axios.put(`/api/api/sample/update/${id}`,
            {
                Name: data?.Name,
                Type: data?.Type,
                Date_Sealed: formattedDate,
                Sol_Sealed: Number(data?.Sol_Sealed),
                Rock_Type: data?.Rock_Type,
                Height: data?.Height,
                Current_Location: data?.Current_Location,
                Image: "",
                Video: "",
                Sample_status: "Active",
            },
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            })
            .then(response => {
                console.log(response);
                AddImage(Number(id));
                navigate("/MSRM/admin/samples")
            }
            )
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div>
            <div className='bread-bar'>
                <NavLink to="/MSRM/" className='bread' style={{ marginLeft: 30 }}>Главная / </NavLink>
                <NavLink to="/MSRM/admin/samples" className='bread'>Образцы / </NavLink>
                {
                    Number(id) === 0 ?
                        <NavLink to="#" className='bread-active'>Создание образца</NavLink>
                        : <NavLink to="#" className='bread-active'>{`Редактирование образца №${id}`}</NavLink>
                }

            </div>
            <Form className='edit-sample'>
                <Card className='card-det-mod'>
                    <Card.Header className='header-det-mod'>
                        {
                            Number(id) === 0 ?
                                <img src={'../../coal.png'} />
                                : <img src={`${data?.Image}`} />

                        }

                    </Card.Header>
                    {
                        Number(id) === 0 ?
                            <Card.Body className='det-mod'>
                                <Card.Title className='title-det-mod'>
                                    {`Название: `}
                                    <input
                                        type="text"
                                        name="Name"
                                        value={editedSample.Name}
                                        onChange={handleInputChange}
                                        style={{ color: "#0d6efd" }}
                                    />
                                </Card.Title>
                                <Card.Text className='text-det-mod'>
                                    {`Тип: `} <br />
                                    <input
                                        type="text"
                                        name="Type"
                                        value={editedSample.Type}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className='text-det-mod'>
                                    {`Тип камня: `} <br />
                                    <input
                                        type="text"
                                        name="Rock_Type"
                                        value={editedSample.Rock_Type}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className='text-det-mod'>
                                    {`Высота: `} <br />
                                    <input
                                        type="text"
                                        name="Height"
                                        value={editedSample.Height}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className='text-det-mod'>
                                    {`Текущее местоположение: `} <br />
                                    <input
                                        type="text"
                                        name="Current_Location"
                                        value={editedSample.Current_Location}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className='text-det-mod'>
                                    {`Дата сбора: `} <br />
                                    <input
                                        type="date"
                                        name="Date_Sealed"
                                        value={editedSample.Date_Sealed}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className='text-det-mod'>
                                    {`Количество собранного материала: `} <br />
                                    <input
                                        type="text"
                                        name="Sol_Sealed"
                                        value={editedSample.Sol_Sealed}
                                        onChange={handleInputChange}
                                    />
                                </Card.Text>
                                <Card.Text className={`text-det-mod`}>
                                    {`Фото: `} <br />
                                    <input
                                        type="file"
                                        name="Image"
                                        onChange={handleImageChange}
                                        style={{ outline: "0", border: "none" }}
                                    />
                                </Card.Text>
                                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'space-between' }}>
                                    <Button variant="outline-secondary" size="sm" style={{ marginTop: "3%" }} onClick={() => { navigate("/MSRM/admin/samples") }}>
                                        Отменить изменения
                                    </Button>
                                    <Button variant="primary" size="sm" style={{ marginTop: "3%" }} onClick={AddSample}>
                                        Сохранить
                                    </Button>
                                </div>
                            </Card.Body>
                            : (data !== undefined) ?
                                <Card.Body className='det-mod'>
                                    <Card.Title className='title-det-mod'>
                                        {`Название: `}
                                        <input
                                            type="text"
                                            name="Name"
                                            value={data.Name}
                                            onChange={handleInputChangeEdit}
                                            style={{ color: "#0d6efd" }}
                                        />
                                    </Card.Title>
                                    <Card.Text className='text-det-mod'>
                                        {`Тип: `} <br />
                                        <input
                                            type="text"
                                            name="Type"
                                            value={data.Type}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className='text-det-mod'>
                                        {`Тип камня: `} <br />
                                        <input
                                            type="text"
                                            name="Rock_Type"
                                            value={data.Rock_Type}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className='text-det-mod'>
                                        {`Высота: `} <br />
                                        <input
                                            type="text"
                                            name="Height"
                                            value={data.Height}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className='text-det-mod'>
                                        {`Текущее местоположение: `} <br />
                                        <input
                                            type="text"
                                            name="Current_Location"
                                            value={data.Current_Location}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className='text-det-mod'>
                                        {`Дата сбора: `} <br />
                                        <input
                                            type="date"
                                            name="Date_Sealed"
                                            value={moment(data.Date_Sealed).format('YYYY-MM-DD')}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className='text-det-mod'>
                                        {`Количество собранного материала: `} <br />
                                        <input
                                            type="text"
                                            name="Sol_Sealed"
                                            value={data.Sol_Sealed}
                                            onChange={handleInputChangeEdit}
                                        />
                                    </Card.Text>
                                    <Card.Text className={`text-det-mod`}>
                                        {`Фото: `} <br />
                                        <input
                                            type="file"
                                            name="Image"
                                            onChange={handleImageChange}
                                            style={{ outline: "0", border: "none" }}
                                        />
                                    </Card.Text>
                                    <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: 'space-between' }}>
                                        <Button variant="outline-secondary" size="sm" style={{ marginTop: "3%" }} onClick={() => { navigate("/MSRM/admin/samples") }}>
                                            Отменить изменения
                                        </Button>
                                        <Button variant="primary" size="sm" style={{ marginTop: "3%" }} onClick={EditSample}>
                                            Сохранить
                                        </Button>
                                    </div>
                                </Card.Body>
                                : null
                    }
                </Card>
            </Form>
        </div>
    );
};

export default EditSample;
