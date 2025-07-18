import React from 'react';
import Freshness from '../../../assets/e-shop/eshop-components/freshness.svg';
import Story from '../../../assets/e-shop/eshop-components/story.svg';
import Shipping from '../../../assets/e-shop/eshop-components/shipping.svg';

const categories = [
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

export default function EshopInfoBoxes() {
  return (
    <div className="eshop-info-boxes-section">
      <div className="eshop-info-boxes">
        {categories.map((item) => (
  <div key={item.title} className="eshop-info-box">
    <img
      src={item.image}
      alt={item.title}
      className="eshop-info-box-img"
    />
    <div className="eshop-info-box-text">
      <div className="title">{item.title}</div>
      <div className="text">
        {item.text.split('\n').map((line, index) => (
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