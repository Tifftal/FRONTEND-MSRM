import { FC, useState } from 'react';
import "./index.css";

interface FilterDateProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const FilterDate: FC<FilterDateProps> = ({ onStartDateChange, onEndDateChange }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
        onStartDateChange(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
        onEndDateChange(event.target.value);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        onStartDateChange('');
        onEndDateChange('');
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div className='filter-mission'>
                <h1>Фильтр по дате формирования</h1>
                <div className='filter-input'>
                    <label>С</label>
                    <input type='date' value={startDate} onChange={handleStartDateChange} max={getCurrentDate()} />
                </div>
                <div className='filter-input'>
                    <label>До</label>
                    <input type='date' value={endDate} onChange={handleEndDateChange} max={getCurrentDate()} />
                </div>
                <button className='filterBtn' type="button" onClick={handleReset}>
                    Сбросить
                </button>
            </div>
        </>
    );
};

export default FilterDate;
