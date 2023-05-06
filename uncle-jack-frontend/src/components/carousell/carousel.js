import Carousel from 'react-bootstrap/Carousel';
import img1 from "../images/carousel3.jpg"
import img2 from "../images/carousel2.jpg"
import "./carousel.css"

function CarouselBanner() {
  return (
    <div className='carou'>
      <Carousel>
        <Carousel.Item>
          <img
            src={img2}
            alt="Great Minimart Sales"
            />
          <Carousel.Caption>
            <h3>Uncle Jack's Fire Sales!</h3>
            <p>Come to my minimart!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={img1}
            alt="Sales"
            />
          <Carousel.Caption>
            <h3>Great Offers approved by Uncles and Aunties!</h3>
            <p>Get your grocery here!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselBanner;
