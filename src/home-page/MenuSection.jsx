import './MenuSection.css';
import coffeeCup from '../assets/main-page/cup.png';

const HeroTextSection = () => {
    return (
        <section className="menu-section" id='menu-section'>
            <div className="menu-image-content">
                <img src={coffeeCup} alt="Coffee Cup" />
            </div>
            <div className="menu-text-content">
                <h2>Menu</h2>
                <p>
                    We care about our filter coffees, but you can also enjoy a great espresso.
                </p>
                <table className='menu-table'>
                    <tr>
                        <td><strong>Batch brew</strong></td>
                        <td className='price'>200ml / 300ml 2$ / 3$</td>
                    </tr>
                    <tr>
                        <td><strong>Hand brew</strong><br />
                            V60 / Chemex / AeroPress
                        </td>
                        <td className='price'>200ml / 300ml 3$ / 4$</td>
                    </tr>
                    <tr>
                        <td><strong>Espresso</strong></td>
                        <td className='price'>2$</td>
                    </tr>
                    <tr>
                        <td><strong>Americano</strong></td>
                        <td className='price'>3$</td>
                    </tr>
                    <tr>
                        <td><strong>Flat white</strong></td>
                        <td className='price'>4$</td>
                    </tr>
                    <tr>
                        <td><strong>Caffe Latte</strong></td>
                        <td className='price'>4$</td>
                    </tr>
                    <tr>
                        <td><strong>Espresso tonic</strong></td>
                        <td className='price'>2$</td>
                    </tr>
                </table>
            </div>
        </section>
    );
};

export default HeroTextSection;