import './HeroSection.css';
import HeroImg from '../assets/main-page/hero-1.jpg';
import MainButton from '../components/MainButton';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <img className="hero-img" src={HeroImg} />
      <div className="hero-img-overlay"></div>
      <div className="hero-text-overlay">
        <h1 className="hero-heading">Morning Mist Coffee</h1>
        <p className="hero-subheading">Fresh filter coffee, ready with the first light of morning.</p>
        <MainButton text="EXPLORE MORE" href="#hero-text-section" color="white" />
      </div>

    </section>
  );
};

export default HeroSection;
