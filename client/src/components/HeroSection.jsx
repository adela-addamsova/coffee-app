import MainButton from './MainButton';

/**
 * HeroSection component
 * Displays a hero/banner section with a background image, optional heading, subheading, and a button
 * 
 * Props:
 * @param {string} imgSrc - background img src
 * @param {string} heading - main heading text (optional)
 * @param {string} subheading - subheading text (optional)
 * @param {string} buttonText - button text (optional)
 * @param {string} buttonHref - button href (optional)
 * @param {string} [buttonColor='white'] - button color
 * @param {string|number} height - hero section height (optional).
 * @param {string} [className=''] - additional CSS class
 * @param {boolean} [showText=true] - controls whether to show the text overlay
 */

const HeroSection = ({
  imgSrc,
  heading,
  subheading,
  buttonText,
  buttonHref,
  buttonColor = 'white',
  height,
  className = '',
  showText = true,
}) => {
  return (
    <section className={`hero-section ${className}`} style={{ height }}>
      <img className="hero-img" src={imgSrc} />
      <div className="hero-img-overlay"></div>

      {showText && (
        <div className="hero-text-overlay">
          {heading && <h1 className="hero-heading">{heading}</h1>}
          {subheading && <p className="hero-subheading">{subheading}</p>}
          {buttonText && (
            <MainButton text={buttonText} href={buttonHref} color={buttonColor} />
          )}
        </div>
      )}
    </section>
  );
};

export default HeroSection;

