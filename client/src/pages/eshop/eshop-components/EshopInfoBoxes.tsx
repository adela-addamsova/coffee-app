import React, { JSX } from "react";
import Freshness from "@assets/e-shop/eshop-components/freshness.svg";
import Story from "@assets/e-shop/eshop-components/story.svg";
import Shipping from "@assets/e-shop/eshop-components/shipping.svg";
import { useTranslation } from "react-i18next";

export interface Category {
  title: string;
  text: string;
  image: string;
}

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

export default function EshopInfoBoxes(): JSX.Element {
  const { t } = useTranslation();

  const categories: Category[] = [
    {
      title: t("eshop.info-box-head-1"),
      text: t("eshop.info-box-text-1"),
      image: Freshness,
    },
    {
      title: t("eshop.info-box-head-2"),
      text: t("eshop.info-box-text-2"),
      image: Story,
    },
    {
      title: t("eshop.info-box-head-3"),
      text: t("eshop.info-box-text-3"),
      image: Shipping,
    },
  ];

  return (
    <div className="eshop-info-boxes-section" data-testid="eshop-info-boxes">
      <div className="eshop-info-boxes">
        {categories.map(({ title, text, image }) => (
          <div key={title} className="eshop-info-box">
            <img src={image} alt={title} className="eshop-info-box-img" />
            <div className="eshop-info-box-text">
              <div className="title">{title}</div>
              <div className="text">
                {text.split("\n").map((line, index) => (
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
