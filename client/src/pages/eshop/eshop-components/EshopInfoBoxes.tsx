import React from 'react';
import Freshness from '../../../assets/e-shop/eshop-components/freshness.svg';
import Story from '../../../assets/e-shop/eshop-components/story.svg';
import Shipping from '../../../assets/e-shop/eshop-components/shipping.svg';

interface Category {
  title: string;
  text: string;
  image: string;
}

const categories: Category[] = [
  {
    title: 'FRESHNESS GUARANTEE',
    text: 'We roast our coffee to ensure\nmaximum flavor.',
    image: Freshness,
  },
  {
    title: 'COFFEE WITH A STORY',
    text: 'We choose local and fair producers\nand sellers of coffee',
    image: Story,
  },
  {
    title: 'FREE SHIPPING',
    text: 'For all registered users and club\nmembers.',
    image: Shipping,
  },
];

/**
 * EshopInfoBoxes component
 * 
 * Renders a set of informational boxes for the e-shop section, each
 * displaying an image, a title, and multi-line descriptive text
 * 
 * Uses a predefined categories array that includes the title, text, and image
 * 
 * @returns {JSX.Element} The e-shop info boxes section element
 */

export default function EshopInfoBoxes() {
  return (
    <div className="eshop-info-boxes-section">
      <div className="eshop-info-boxes">
        {categories.map(({ title, text, image }) => (
          <div key={title} className="eshop-info-box">
            <img
              src={image}
              alt={title}
              className="eshop-info-box-img"
            />
            <div className="eshop-info-box-text">
              <div className="title">{title}</div>
              <div className="text">
                {text.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
