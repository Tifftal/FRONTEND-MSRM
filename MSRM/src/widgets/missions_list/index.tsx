import { FC } from 'react';
import "./index.css"
import { Card, Table } from 'react-bootstrap';

interface MissionListProps {
    dateFormation: string;
    status: string;
    ID: number;
    name: string;
}

const MissionList: FC<MissionListProps> = ({ dateFormation, status, ID, name }) => {
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };

        const formattedDate = new Date(dateString).toLocaleDateString('ru-RU', options);
        return `${formattedDate}`;
    };

    return (
        <div>
            <Card className="list-card" style={{ backgroundColor: "rgba(13, 109, 253, 0.1)" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Card.Title style={{ fontFamily: "Montserrat-medium", margin: 0 }}>Заказ №{ID}</Card.Title>
                    <Card.Subtitle style={{ fontFamily: "Montserrat-regular", margin: 0 }} className="mb-2 text-muted">
                        {status === "Awaiting confirmation" ? "Ожидает подтверждения" : status === "Completed" ? "Завершен" : status === "At work" ? "В работе" : status === "Rejected" ? "Отменен " : status}
                    </Card.Subtitle>

                </div>
                <p>Дата заказа: {formatDate(dateFormation)}</p>
                <p>Имя: {name}</p>

                {/* <Card.Text className='table-mis-list'>
                    <h2>Заказанные образцы</h2>
                    <Table hover>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Jacob</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Text> */}
            </Card>
        </div>
    );
}

export default MissionList;
