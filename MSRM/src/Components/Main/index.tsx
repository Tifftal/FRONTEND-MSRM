import { FC } from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

const Main: FC = () => {
    const token = window.localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : 'Guest';
    return (
        <div className="MainPage">
            <video id="background-video" preload="auto" no-controls autoPlay loop playsInline muted height="100%" width="100%">
                {/* <source src="../../marsVideo.mp4" /> */}
                <source src="/MSRM/marsVideo.mp4" />
            </video>
            <div className="cont">
                <div className="welcome">
                    <h1>Образцы грунта с Марса на Землю</h1>
                    {
                        decodedToken.role === 'Moderator' ?
                            <NavLink to="/MSRM/admin/samples"><button>к образцам</button></NavLink>
                            : <NavLink to="/MSRM/samples"><button>к образцам</button></NavLink>
                    }
                </div>
                <div className="facts">
                    <div className="fact">
                        <h2>собрано</h2>
                        <p>27 образцов</p>
                    </div>
                    <div className="fact">
                        <h2>Запуск планируется</h2>
                        <p>в 2027</p>
                    </div>
                    <div className="fact">
                        <h2>Ожидается возвращение на Землю</h2>
                        <p>в 2033</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Main
