import React, { JSX } from "react";
import SocialIcons from "./SocialIcons";
import { coffeeHouseData } from "@config/CoffeeHouseData";

interface BoxData {
  title: string;
  text: React.ReactNode;
  icons: string[];
}

/**
 * boxesData
 *
 * An array defining the content and icons of each informational box
 * shown in the InfoBoxes component.
 */
const boxesData: BoxData[] = [
  {
    title: "CONTACT",
    text: (
      <>
        <p>{coffeeHouseData.contact.phone}</p>
        <a href={`mailto:${coffeeHouseData.contact.email}`}>
          {coffeeHouseData.contact.email}
        </a>
      </>
    ),
    icons: ["social-icons"],
  },
  {
    title: "OPENING HOURS",
    text: (
      <>
        <p>
          {coffeeHouseData.openingHours.weekdays}
          <br />
          {coffeeHouseData.openingHours.weekdaysTime}
        </p>
        <p>
          {coffeeHouseData.openingHours.weekend}
          <br />
          {coffeeHouseData.openingHours.weekendTime}
        </p>
      </>
    ),
    icons: [],
  },
  {
    title: "LOCATION",
    text: (
      <>
        <p>{coffeeHouseData.address.street}</p>
        <p>{coffeeHouseData.address.city}</p>
        <p>{coffeeHouseData.address.zip}</p>
      </>
    ),
    icons: [],
  },
];

/**
 * InfoBoxes component
 *
 * Renders informational boxes displaying contact details, opening hours, and location
 * Based on the predefined `boxesData` array.
 *
 * @returns {JSX.Element} The info boxes section element
 */
const InfoBoxes = (): JSX.Element => {
  return (
    <div className="info-boxes" id="info-boxes" data-testid="info-boxes">
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
