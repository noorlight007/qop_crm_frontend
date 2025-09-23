import SVG from "@/CommonComponent/SVG";
import { Badge, Input, InputGroup, InputGroupText } from "reactstrap";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SwiperSlideCommon: React.FC = ({ sliderData }:any) => {
  return (
    <div className="items-slider">
      <div className="swiper mySwiper1">
        <div className="swiper-wrapper">
          <Swiper navigation={true} modules={[Pagination, Autoplay, Navigation]} centeredSlides={true} className="mySwiper" autoplay>
            {sliderData.map((data:any, index:any) => (
              <SwiperSlide key={index}>
                <div className={`slider-box bg-light-${data.color}`}>
                  <div className="header-top">
                    <Badge color={data.color} className="rated-product-badge">
                      {data.badge}
                    </Badge>
                    <img className="img-fluid" src={`../assets/images/${data.image}`} alt="SwiperSlideCommon" />
                    <div className="i fa fa-heart-o" />
                  </div>
                </div>
                <div className="slider-content text-center">
                  <h4 className={`text-${data.color}`}>{data.title}</h4>
                  <p className="mb-0">{data.text}</p>
                  <h6>
                    {data.newPrice}
                    <span>&nbsp;{data.price}</span>
                  </h6>
                  <InputGroup>
                    <InputGroupText className="decrement-touchspin">
                      <SVG className="svg-color" iconId="minus" />
                    </InputGroupText>
                    <Input className={`bg-light-${data.color} input-touchspin`} type="text" defaultValue={1} />
                    <InputGroupText className="increment-touchspin">
                      <SVG className="svg-color" iconId="plus" />
                    </InputGroupText>
                  </InputGroup>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SwiperSlideCommon;
