import { JSX } from "react";
import coffeeCup from "@assets/main-page/cup.png";
import { useTranslation } from "react-i18next";

/**
 * MenuSection component
 *
 * Displays the coffee menu section on the landing page
 *
 * @returns {JSX.Element} The menu section of the homepage
 */

const MenuSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section
      className="menu-section"
      id="menu-section"
      data-testid="menu-section"
    >
      <div className="menu-image-content">
        <img src={coffeeCup} alt="Coffee Cup" />
      </div>
      <div className="menu-text-content">
        <h2>Menu</h2>
        <p>{t("home.menu-text")}</p>
        <table className="menu-table">
          <tbody>
            <tr>
              <td>
                <strong>Batch brew</strong>
              </td>
              <td className="price">200ml / 300ml $2 / $3</td>
            </tr>
            <tr>
              <td>
                <strong>Hand brew</strong>
                <br />
                V60 / Chemex / AeroPress
              </td>
              <td className="price">200ml / 300ml $3 / $4</td>
            </tr>
            <tr>
              <td>
                <strong>Espresso</strong>
              </td>
              <td className="price">$2</td>
            </tr>
            <tr>
              <td>
                <strong>Americano</strong>
              </td>
              <td className="price">$3</td>
            </tr>
            <tr>
              <td>
                <strong>Flat white</strong>
              </td>
              <td className="price">$4</td>
            </tr>
            <tr>
              <td>
                <strong>Caffe Latte</strong>
              </td>
              <td className="price">$4</td>
            </tr>
            <tr>
              <td>
                <strong>Espresso tonic</strong>
              </td>
              <td className="price">$2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MenuSection;
