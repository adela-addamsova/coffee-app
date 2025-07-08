import SocialIcons from './SocialIcons';
import { contactInfo, addressInfo, openingHours } from '../config/CoffeeHouseData';

/**
 * boxesData
 * Array defining the content and structure of each info box
 */
const boxesData = [
  {
    title: 'CONTACT',
    text: (
      <>
        <p>{contactInfo.phone}</p>
         <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
      </>
    ),
    icons: ['social-icons'] 
  },
  {
    title: 'OPENING HOURS',
    text: (
      <>
        <p>{openingHours.weekdays}<br />{openingHours.weekdaysTime}</p>
        <p>{openingHours.weekend}<br />{openingHours.weekendTime}</p>
      </>
    ),
    icons: []
  },
  {
    title: 'LOCATION',
    text: (
      <>
        <p>{addressInfo.street}</p>
        <p>{addressInfo.city}</p>
        <p>{addressInfo.zip}</p>
      </>
    ),
    icons: []
  }
];

/**
 * InfoBoxes component
 * Renders a set of informational boxes (contact, opening hours, location)
 * using the boxesData array
 */
const InfoBoxes = () => {
  return (
    <div className="info-boxes" id='info-boxes'>
      {boxesData.map((col) => (
        <div className="column info-box" key={col.title}>
          <h4>{col.title}</h4>
          {col.text}
          {col.icons.length > 0 && (
            <div className="icons">
              {col.icons.map((iconName, idx) => (
                <SocialIcons key={iconName + idx} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InfoBoxes;
