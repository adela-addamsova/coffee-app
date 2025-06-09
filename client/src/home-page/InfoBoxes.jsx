import './InfoBoxes.css';
import SocialIcons from '../components/SocialIcons';

const boxesData = [
  {
    title: 'CONTACT',
    text: (
      <>
        <p>+420 777 777 777</p>
        <a href="mailto:morningmistcoffee@gmail.com">morningmistcoffee@gmail.com</a>
      </>
    ),
    icons: ['social-icon'] 
  },
  {
    title: 'OPENING HOURS',
    text: (
      <>
        <p>Monday–Friday<br />06:00–17:00</p>
        <p>Saturday–Sunday<br />07:00–17:00</p>
      </>
    ),
    icons: []
  },
  {
    title: 'LOCATION',
    text: (
      <>
        <p>Kolumbijská 1720/17</p>
        <p>Praha 5</p>
        <p>15000</p>
      </>
    ),
    icons: []
  }
];

const InfoBoxes = () => {
  return (
    <section className="info-boxes">
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
    </section>
  );
};

export default InfoBoxes;
