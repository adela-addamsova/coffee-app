import './css/HeroTextSection.css';
import CoffeeSack from '../assets/main-page/coffee-sack.png';

const HeroTextSection = () => {
    return (
        <section className="hero-text-section" id='hero-text-section'>
            <div className="hero-text-content">
                <h2>We pick the best
                    coffee beans</h2>
                <p>
                    At Morning Mist Coffee, we take pride in sourcing premium-quality beans from carefully selected regions. Our light roast features handpicked beans from South America, known for their bright acidity and smooth, citrusy notes. For those who prefer a richer profile, our medium and dark roasts bring out deeper chocolate and caramel flavors, sourced from Central American and African plantations. Every batch is freshly ground and brewed to perfection, ensuring a full-bodied taste that highlights the unique characteristics of each origin. Whether you're looking for a delicate morning sip or a bold espresso kick, our coffee is crafted to elevate your experience with every cup.
                </p>
            </div>
            <div className="hero-image-content">
                <img src={CoffeeSack} alt="Coffee Sack" />
            </div>
        </section>
    );
};

export default HeroTextSection;