import phoneBackground from '../assets/main-page/phone.png';
import MainButton from '../components/MainButton';


const ReservationSection = () => {
    return (
        <section className="reservation-section" id='reservation-section'>
            <div className="reservation-content reservation-image">
                <img src={phoneBackground} alt="Beans Background" />
            </div>
            <div className="reservation-content reservation-text">
                <p>
                    Do you want to make sure you’ll have a free seat when you come?
                    You can contact us on our email,
                    social media or make a reservation
                    in our system.
                </p>
                <MainButton text="RESERVATION" to="/reservation" color="black" />
            </div>
        </section>
    );
};

export default ReservationSection;
