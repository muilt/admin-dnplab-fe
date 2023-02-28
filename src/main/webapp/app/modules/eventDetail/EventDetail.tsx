/* eslint-disable no-useless-escape */
/* eslint-disable no-irregular-whitespace */
import Box from "@material-ui/core/Box";
import { Typography } from "@mui/material";
import commonText from "app/lang/ja/commonText";
import event from "app/lang/ja/event";
import api from "app/routes/api";
import router from "app/routes/router";
import { setLoading, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { isSuccessApi } from "app/shared/util/constants";
import { convertDate } from "app/shared/util/convertDate";
import { get, post } from "app/shared/util/service";
import * as React from "react";
import ImageGallery from "react-image-gallery";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonComponent from "../commons/Button";
import { OverLay } from "../commons/OverLay";
import TagsSwiper from "./TagsSwiper";

const EventDetail = (props) => {
  const [eventDetail, setEventDetail] = React.useState(null);
  const eventId = props.match.params.id;
  const history = useHistory();
  const [imageDetail, setImageDetail] = React.useState([]);
  const [description, setDescription] = React.useState("");
  const [isOpenPopupLockEvent, setIsOpenPopupLockEvent] = React.useState(false);
  const [isShowPopupImage, setIsShowPopupImage] = React.useState(false);
  const refImg = React.useRef(null);
  const [currentIndexImg, setCurrentIndexImg] = React.useState(0);
  const defaultImage = [
    {
      original: "/content/images/image-default.png",
      thumbnail: null,
    },
  ];

  React.useEffect(() => {
    getEventDetail();
  }, [eventId]);

  // get event detail by id
  const getEventDetail = async () => {
    props.setLoading(true);
    await get(`${api.event.getListEvent}/${eventId}`)
      .then((res) => {
        if (isSuccessApi(res.status)) {
          if (res.data?.data) {
            setValueEventDetail(res.data.data);
          } else setEventDetail(null);
        } else {
          setEventDetail(null);
          props.setSeverityType("error");
          props.setMessageText(res.data?.message || event.details.eventNotFound);
        }
        props.setLoading(false);
      })
      .catch((err) => {
        setEventDetail(null);
        props.setSeverityType("error");
        props.setMessageText(event.details.eventNotFound);
        props.setLoading(false);
      });
  };

  const setValueEventDetail = (data: any) => {
    setEventDetail(data);
    if (data?.description) {
      convertDescription(data?.description);
    }
    if (data?.images?.length > 0) {
      const image = [];
      data.images.forEach((img) => {
        image.push({
          original: img,
          thumbnail: img,
        });
      });
      setImageDetail(image);
    } else setImageDetail(defaultImage);
  };

  // convert the text http://, https://, www. link form
  const convertDescription = (data) => {
    const URL_REGEX = /(((http(s)?:\/\/)|(www\.))[^\s!$^*()\[\]{};'",<>\`\~]+)/g;
    const words = data?.replace(/</g, "&lt;")?.replace(/>/g, "&gt;");
    setDescription(() => {
      return (
        `${words
          ?.replace(URL_REGEX, function ($1) {
            if ($1.indexOf("www") === 0) {
              return `<a href="http://${$1}" target="_blank">${$1}</a>`;
            } else return `<a href="${$1}" target="_blank">${$1}</a>`;
          })
          .replace(/\n/g, "<br/>")}` || ""
      );
    });
  };

  // handle convert show date
  const convertShowDate = (date) => {
    let newDate = date;
    const regex = /[a-zA-Z]$/;
    if (regex.test(date)) {
      newDate = date.slice(0, date?.length - 1);
    }
    return convertDate(newDate);
  };

  // handle display event address
  const getDataAddress = () => {
    const arrayAddress = [];
    if (eventDetail.prefecture_name) {
      arrayAddress.push(eventDetail.prefecture_name);
    }
    if (eventDetail.district) {
      arrayAddress.push(eventDetail.district);
    }
    if (eventDetail.address) {
      arrayAddress.push(eventDetail.address);
    }
    return arrayAddress.join("");
  };

  // back to the event list screen
  const redirectEventList = React.useCallback(() => {
    history.push(router.event);
  }, []);

  // handle lock or unlock event
  const handleUpdateStatusEvent = React.useCallback(async () => {
    setIsOpenPopupLockEvent(false);
    props.setLoading(true);
    if (eventDetail?.status !== 3) {
      // call the event lock api
      await post(`${api.event.lockEvent}/${eventId}`)
        .then(async (res) => {
          if (isSuccessApi(res.status)) {
            await getEventDetail();
            props.setMessageText(event.details.lockEventSuccess);
            props.setSeverityType("success");
          } else {
            props.setMessageText(res.data?.message || event.details.lockEventError);
            props.setSeverityType("error");
          }
        })
        .catch(() => {
          props.setMessageText(event.details.lockEventError);
          props.setSeverityType("error");
        });
    } else {
      // call the event unlock api
      await post(`${api.event.unlockEvent}/${eventId}`)
        .then(async (res) => {
          if (isSuccessApi(res.status)) {
            await getEventDetail();
            props.setMessageText(event.details.unlockEventSuccess);
            props.setSeverityType("success");
          } else {
            props.setMessageText(res.data?.message || event.details.unlockEventError);
            props.setSeverityType("error");
          }
        })
        .catch(() => {
          props.setMessageText(event.details.unlockEventError);
          props.setSeverityType("error");
        });
    }
    props.setLoading(false);
  }, [isOpenPopupLockEvent]);

  // handle unlock popup or unlock event
  const setShowPopupLockEvent = React.useCallback(() => {
    setIsOpenPopupLockEvent(!isOpenPopupLockEvent);
  }, [isOpenPopupLockEvent]);

  // show/hide popup image
  const handleShowImage = React.useCallback(() => {
    setCurrentIndexImg(refImg.current.getCurrentIndex());
    setIsShowPopupImage(!isShowPopupImage);
  }, [isShowPopupImage]);

  return (
    <div>
      {eventDetail && (
        <>
          <Box className="page-content event-detail">
            <Box mb={1}>
              <Typography>
                <span onClick={redirectEventList} className="pointer text-decoration-underline">
                  {commonText.titlePage.eventList}
                </span>
                {`>${eventDetail?.id ? eventDetail?.id + ":" : ""}${eventDetail?.title || ""}`}
              </Typography>
            </Box>
            <Box
              className={`event-detail-title ${
                eventDetail?.status === 3 ? "button-unlock-event" : "button-lock-event"
              }`}
            >
              <Box className="fs-22-text font-weight-bold">{event.details.title}</Box>
              <ButtonComponent
                name={eventDetail?.status === 3 ? event.details.buttonUnlockEvent : event.details.buttonLockEvent}
                handleClick={setIsOpenPopupLockEvent}
              />
            </Box>
            <Box className="event-detail-content">
              <Box className="tag-select" mb={3}>
                <TagsSwiper areaTags={eventDetail?.area_tags || []} purposeTags={eventDetail?.purpose_tags || []} />
              </Box>
              <Box className="event-detail-content-items">
                {imageDetail?.length > 0 && (
                  <Box className="event-detail-content-items-image">
                    <ImageGallery
                      ref={refImg}
                      items={imageDetail}
                      showPlayButton={false}
                      showFullscreenButton={false}
                      pauseIconSize="40px"
                      onClick={handleShowImage}
                    />
                  </Box>
                )}
              </Box>
              <Box className="event-detail-content-items-content">
                <Typography className="fs-14-text">
                  {event.details.eventDate}
                  {convertShowDate(eventDetail.start_period)}　~　{convertShowDate(eventDetail.end_period)}
                </Typography>
                <Typography mt={3} className="fs-14-text">
                  {event.details.address}
                  {getDataAddress()}
                </Typography>
              </Box>
              <div dangerouslySetInnerHTML={{ __html: description }} style={{ marginTop: 20 }} className="fs-14-text" />
              <Box textAlign={"right"} mt={4} sx={{ color: "white !important" }} className="fs-14-text">
                {eventDetail?.unique_id || ""}
              </Box>
            </Box>
          </Box>
          <OverLay isOpen={isOpenPopupLockEvent} setIsOpen={setShowPopupLockEvent}>
            <Box>
              <Box mb={3} mt={3} sx={{ color: "black" }} className="fs-12-text">
                {eventDetail?.status !== 3 ? event.details.confirmLockEvent : event.details.confirmUnlockEvent}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box mr={1} className="background-cancel-reg">
                  <ButtonComponent name={commonText.buttonCancel} handleClick={setShowPopupLockEvent} />
                </Box>
                <ButtonComponent
                  name={eventDetail?.status !== 3 ? event.details.buttonLockEvent : event.details.buttonUnlockEvent}
                  handleClick={handleUpdateStatusEvent}
                />
              </Box>
            </Box>
          </OverLay>
          <OverLay isOpen={isShowPopupImage} setIsOpen={handleShowImage}>
            <Box className="popup-show-image">
              {imageDetail?.length > 0 && (
                <Box className="popup-show-image-items">
                  <ImageGallery
                    items={imageDetail}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    pauseIconSize="40px"
                    startIndex={currentIndexImg}
                  />
                </Box>
              )}
            </Box>
          </OverLay>
        </>
      )}
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setMessageText,
  setSeverityType,
  setLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);
