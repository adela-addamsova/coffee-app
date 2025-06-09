import Header from '../components/Header';
import Footer from '../components/Footer';
import ReservationForm from '../reservation-page/ReservationForm';
import HeroSection from '../components/HeroSection';
import './ReservationPage.css';
import HeroImg from '../assets/reservation-page/reservation-hero.png';

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
      <section className="main-content-reservation">
        <div className='reservation-form'>
          <ReservationForm />
        </div>
        <div className='reservation-img'>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ReservationPage;