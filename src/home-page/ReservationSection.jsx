import './ReservationSection.css';
import beansBackground from '../assets/main-page/coffee-beans-bck.png';
import MainButton from '../components/MainButton';


const ReservationSection = () => {
    return (
        <section className="reservation-section" id='reservation-section'>
            <div className="reservation-content reservation-image">
                <img src={beansBackground} alt="Beans Background" />
            </div>
            <div className="reservation-content reservation-text">
                <p>
                    Do you want to make sure you’ll have free seat when you come?
                    You can contact us on out email,
                    social media or make a reservation
                    in our system.
                </p>
                <MainButton text="RESERVATION" href="#" color="black" />
            </div>
        </section>
    );
};

export default ReservationSection;
