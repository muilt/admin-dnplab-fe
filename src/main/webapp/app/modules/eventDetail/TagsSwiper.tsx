import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode, Pagination } from "swiper";

const TagsSwiper = (props) => {
  const { areaTags, purposeTags } = props;

  return (
    <>
      <Swiper
        spaceBetween={10}
        freeMode={true}
        pagination={false}
        modules={[FreeMode, Pagination]}
        grabCursor={true}
        slidesPerView={"auto"}
      >
        {areaTags?.length > 0 &&
          areaTags.map((area: any) => {
            return (
              <SwiperSlide key={area.id} className="area-tag fs-12-text">
                {area.tag_name}
              </SwiperSlide>
            );
          })}
        {purposeTags?.length > 0 &&
          purposeTags.map((purpose: any) => {
            return (
              <SwiperSlide key={purpose.id} className="purpose-tag fs-14-text">
                {purpose.tag_name}
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};

export default TagsSwiper;
