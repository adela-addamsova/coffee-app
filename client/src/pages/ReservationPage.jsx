import Header from '../components/Header';
import Footer from '../components/Footer';
import ReservationForm from '../reservation-page/ReservationForm';
import HeroSection from '../components/HeroSection';
import './css/ReservationPage.css';
import HeroImg from '../assets/reservation-page/reservation-hero.png';
import BeansBackground from '../assets/reservation-page/beans-bck.png';
import InfoBoxes from '../components/InfoBoxes'

const ReservationPage = () => {
  return (
    <>
      <Header />
      <HeroSection
        imgSrc={HeroImg}
        heading="Reservation"
        subheading={false}
        buttonText={false}
        buttonHref={false}
      />
      <div className='reservation-page-container'>
      <InfoBoxes />
      <section className="main-content-reservation">
        <div className='reservation-form'>
          <ReservationForm />
        </div>
        <div className='reservation-img'>
          <img src={BeansBackground} alt="Beans Background" />
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}

export default ReservationPage;