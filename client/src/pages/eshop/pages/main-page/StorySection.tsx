import React, { JSX } from 'react';
import MainButton from '../../../../components/MainButton';
import { navItems } from '../../../../config/NavItems';
import StoryImg from '../../../../assets/e-shop/story-img.png';

/**
 * StorySection
 * 
 * Displays the "Our Story" section with a description,
 * an image, and a button linking to the story page/section.
 * 
 * @returns {JSX.Element} The rendered story section.
 */
export default function StorySection(): JSX.Element {
  const storyLink = navItems.find(item =>
    ['Our Story'].includes(item.label)
  );
  const linkTarget = `/#${storyLink?.sectionId ?? ''}`;

  return (
    <section className="eshop-story-section">
      <div className="eshop-story-text-content">
        <h2 className='eshop-heading'>Our story</h2>
        <p>
          Our coffee roastery has existed since 2005. Since then, we have come a long way in improving our roasting processes and today we offer you not only selected coffee, but also the opportunity to cooperate. For companies and individuals, we have a range of roasted coffee beans, equipment and know-how to prepare great coffee in every operation.
        </p>
        <MainButton text="EXPLORE MORE" to={linkTarget} color="black" />
      </div>
      <div className="hero-image-content">
        <img src={StoryImg} alt="Story Img" />
      </div>
    </section>
  );
}
