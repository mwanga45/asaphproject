'use client'
import React, { useState, useEffect } from 'react';

const SlideShow = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  let timer = null;

  // Handle automatic slide transition
  useEffect(() => {
    if (autoPlay) {
      timer = setTimeout(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slideshow-container">
      {/* Slides */}
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={slide} 
              alt={`Slide ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>

      {/* Dots Navigation */}
      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .slideshow-container {
          position: relative;
          max-width: 1000px;
          margin: auto;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .slides-container {
          position: relative;
          height: 400px;
        }

        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }

        .slide.active {
          opacity: 1;
        }

        /* Navigation arrows */
        .prev, .next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          padding: 16px;
          color: white;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          background-color: rgba(0,0,0,0.3);
          border: none;
          transition: 0.3s;
          border-radius: 4px;
        }

        .next {
          right: 0;
        }

        .prev:hover, .next:hover {
          background-color: rgba(0,0,0,0.8);
        }

        .dots-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: 0.3s;
        }

        .dot.active, .dot:hover {
          background-color: rgba(255,255,255,0.9);
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};
export default SlideShow;