import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import img1 from '../assets/main-page/interior-1.png';
import img2 from '../assets/main-page/interior-2.png';
import img3 from '../assets/main-page/interior-3.png';
import galleryGrid1 from '../assets/main-page/gallery-grid-1.png';
import galleryGrid2 from '../assets/main-page/gallery-grid-2.png';
import galleryGrid3 from '../assets/main-page/gallery-grid-3.png';
import galleryGrid4 from '../assets/main-page/gallery-grid-4.png';
import galleryGrid5 from '../assets/main-page/gallery-grid-5.png';
import { Navigation } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const FullWidthSwiper = () => {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allImages = [
        { src: img1 },
        { src: img2 },
        { src: img3 },
        { src: galleryGrid1 },
        { src: galleryGrid2 },
        { src: galleryGrid3 },
        { src: galleryGrid4 },
        { src: galleryGrid5 },
    ];

    const handleImageClick = (index) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    return (
        <div id="gallery-section" className="gallery-section">
            {/* Desktop Swiper */}
            <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                className="desktop-gallery-swiper"
            >
                <SwiperSlide>
                    <div className="slide-content-1">
                        <div className="gallery-text">
                            <p>
                                We create a cozy place with delicious coffee where you can work,
                                read, meet a friend or just enjoy a moment...
                            </p>
                        </div>
                        <div className="gallery-images">
                            {[img1, img2, img3].map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Interior ${i + 1}`}
                                    onClick={() => handleImageClick(i)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-content-2">
                        <div className="gallery-row">
                            {[galleryGrid1, galleryGrid2].map((img, i) => (
                                <div className="gallery-image-box" key={i}>
                                    <img
                                        src={img}
                                        alt={`Grid ${i + 1}`}
                                        onClick={() => handleImageClick(i + 3)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="gallery-row">
                            <div className="gallery-image-box">
                                <img
                                    src={galleryGrid3}
                                    alt="Grid 3"
                                    onClick={() => handleImageClick(5)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <img
                                    src={galleryGrid4}
                                    alt="Grid 4"
                                    onClick={() => handleImageClick(6)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <div className="gallery-image-box">
                                <img
                                    src={galleryGrid5}
                                    alt="Grid 5"
                                    onClick={() => handleImageClick(7)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            {/* Mobile Swiper */}
            <div className="mobile-gallery-swiper">
                <p>
                    We create a cozy place with delicious coffee where you can work,
                    read, meet a friend or just enjoy a moment...
                </p>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    modules={[Navigation]}
                    navigation
                >
                    {allImages.map((img, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={img.src}
                                alt={`Mobile Gallery ${i}`}
                                onClick={() => handleImageClick(i)}
                                style={{ width: '100%', height: 'auto', objectFit: 'cover', cursor: 'pointer' }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Lightbox */}
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={allImages}
                index={currentIndex}
            />
        </div>
    );
};

export default FullWidthSwiper;
