import React, { JSX } from "react";
import MainButton from "./MainButton";

export interface HeroSectionProps {
  imgSrc: string;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonColor?: string;
  className?: string;
  showText?: boolean;
}

/**
 * HeroSection component
 *
 * Displays a hero/banner section with a background image and optional overlay text,
 * including a heading, subheading, and a call-to-action button.
 *
 * @param imgSrc - Background image source
 * @param heading - Optional main heading text
 * @param subheading - Optional subheading text
 * @param buttonText - Optional button label text
 * @param buttonHref - Optional URL the button links to
 * @param buttonColor - Optional button color (default is 'white')
 * @param height - Optional CSS height for the hero section
 * @param className - Optional additional CSS classes for styling
 * @param showText - Whether to show the overlay text and button (default: true)
 * @returns {JSX.Element} The hero section element
 */

function HeroSection({
  imgSrc,
  heading,
  subheading,
  buttonText,
  buttonHref,
  buttonColor = "white",
  className = "",
  showText = true,
}: HeroSectionProps): JSX.Element {
  return (
    <section className={`hero-section ${className}`} data-testid="hero-section">
      <img className="hero-img" src={imgSrc} alt={heading || "Hero image"} />
      <div className="hero-img-overlay"></div>

      {showText && (
        <div className="hero-text-overlay">
          {heading && <h1 className="hero-heading">{heading}</h1>}
          {subheading && <p className="hero-subheading">{subheading}</p>}
          {buttonText && (
            <MainButton
              text={buttonText}
              href={buttonHref}
              color={buttonColor}
            />
          )}
        </div>
      )}
    </section>
  );
}

export default HeroSection;
