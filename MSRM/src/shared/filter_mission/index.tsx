import { FC } from 'react';
import "./index.css"

const FilterDate: FC = () => {

    return (
        <div className='filter-mission'>
            <h1>Фильтр по дате заказа</h1>
            <div className='filter-input'>
                <label>С</label>
                <input type='date' />
            </div>
            <div className='filter-input'>
                <label>До</label>
                <input type='date' />
            </div>
            <button className='filterBtn' type="button">
                Сбросить
            </button>
        </div>
    );
}

export default FilterDate;