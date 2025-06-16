import MainButton from './MainButton';

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
      <img className="hero-img" src={imgSrc} alt="" />
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

