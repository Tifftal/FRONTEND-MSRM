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
        <tr>
            <td>{ID}</td>
            <td>{formatDate(dateFormation)}</td>
            <td>{name}</td>
            <td> {status === "Awaiting confirmation" ? "Ожидает подтверждения" : status === "Completed" ? "Завершен" : status === "At work" ? "В работе" : status === "Rejected" ? "Отменен " : status}</td>
        </tr>
    );
}

export default MissionList;
