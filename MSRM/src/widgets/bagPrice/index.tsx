import { FC } from 'react';
import "./index.css"
import { Button, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';
import { useBag } from '../../features/useBag';

interface BagPriceProps {
    count: number;
}

const BagPrice: FC<BagPriceProps> = ({ count }) => {
    const {
        ChangeStatus
    } = useBag();

    return (
        <div className='bag-price'>
            <Card style={{ margin: 0 }}>
                <Card.Body>
                    <Card.Title className='title-price'>Оформление заказа</Card.Title>
                    <Card.Text>
                        <div className='list-bag'>
                            <p>Доставка</p>
                            <p>150 дней </p>
                        </div>
                        <div className='list-bag'>
                            <p>Кол-во образцов</p>
                            <p>{count} шт</p>
                        </div>
                    </Card.Text>
                    <div className='priceBtn'>
                        <Button variant="primary" size="sm" onClick={() => ChangeStatus("Awaiting confirmation")}>Оформить</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => ChangeStatus("Deleted")}>Очистить корзину</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default BagPrice;