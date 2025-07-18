import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ReservationForm from '../reservation-page/ReservationForm';
import HeroSection from '../../components/HeroSection';
import HeroImg from '../../assets/reservation-page/reservation-hero.jpg';
import BeansBackground from '../../assets/reservation-page/beans-bck.png';
import InfoBoxes from '../../components/InfoBoxes';

const ReservationPage = () => {
  return (
    <>
      <Header />
      <div className='reservation-page-hero'>
        <HeroSection
          imgSrc={HeroImg}
          heading="Reservation"
          subheading={false}
          buttonText={false}
          buttonHref={false}
        />
      </div>
      <div className="reservation-page-container">
        <InfoBoxes />
        <div className="main-content-reservation">
          <div className='reservation-form-box'>
            <ReservationForm />
          </div>
          <div className='reservation-img'>
            <img src={BeansBackground} alt="Beans Background" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ReservationPage;
