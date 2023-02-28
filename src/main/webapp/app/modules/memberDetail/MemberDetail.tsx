/* eslint-disable no-irregular-whitespace */
import { Box, Grid } from "@mui/material";
import commonText from "app/lang/ja/commonText";
import member from "app/lang/ja/member";
import api from "app/routes/api";
import router from "app/routes/router";
import { setLoading, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { isSuccessApi } from "app/shared/util/constants";
import { convertDateMember } from "app/shared/util/convertDate";
import { get, post } from "app/shared/util/service";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import ButtonComponent from "../commons/Button";
import { OverLay } from "../commons/OverLay";
import { TitleScreen } from "../commons/TitleScreen";

const MemberDetail = (props: any) => {
  const history = useHistory();
  const [memberDetailData, setMemberDetailData] = React.useState(null);
  const memberId = props.match.params.id;
  const [isOpenPopupLockMember, setIsOpenPopupLockMember] = React.useState(false);

  React.useEffect(() => {
    getDataMemberDetail();
  }, []);

  // handling member data
  const getDataMemberDetail = async () => {
    props.setLoading(true);
    await get(`${api.member.getListMember}/${memberId}`)
      .then((res) => {
        if (isSuccessApi(res.status)) {
          if (res.data?.data) {
            setMemberDetailData(res.data.data);
          } else setMemberDetailData(null);
        } else {
          setMemberDetailData(null);
          props.setSeverityType("error");
          props.setMessageText(res.data?.message || member.details.memberNotFound);
        }
        props.setLoading(false);
      })
      .catch(() => {
        setMemberDetailData(null);
        props.setSeverityType("error");
        props.setMessageText(member.details.memberNotFound);
        props.setLoading(false);
      });
  };

  // handle convert show date
  const convertShowDate = (date) => {
    let newDate = date;
    const regex = /[a-zA-Z]$/;
    if (regex.test(date)) {
      newDate = date.slice(0, date?.length - 1);
    }
    return convertDateMember(newDate);
  };

  // get the address of the event
  const getDataAddress = () => {
    const arrayAddress = [];
    if (memberDetailData.postal_code) {
      arrayAddress.push(memberDetailData.postal_code);
    }
    if (memberDetailData.prefecture_name) {
      arrayAddress.push(memberDetailData.prefecture_name);
    }
    if (memberDetailData.district) {
      arrayAddress.push(memberDetailData.district);
    }
    if (memberDetailData.address) {
      arrayAddress.push(memberDetailData.address);
    }
    const dataAddress = arrayAddress.join("");
    return dataAddress;
  };

  // handle the move to the member list screen
  const goToBackListMember = React.useCallback(() => {
    history.push(`${router.memberList}`);
  }, []);

  // open popup lock member
  const showPopupLockMember = React.useCallback(() => {
    setIsOpenPopupLockMember(true);
  }, [isOpenPopupLockMember]);

  // handle lock or unlock member
  const handleUpdateStatusMember = async () => {
    setIsOpenPopupLockMember(false);
    props.setLoading(true);
    if (memberDetailData?.status !== 4) {
      // call the member lock api
      await post(`${api.member.lockMember}/${memberId}`)
        .then(async (res) => {
          if (isSuccessApi(res.status)) {
            await getDataMemberDetail();
            props.setMessageText(member.details.lockMemberSuccess);
            props.setSeverityType("success");
          } else {
            props.setMessageText(res.data?.message || member.details.lockMemberError);
            props.setSeverityType("error");
          }
        })
        .catch(() => {
          props.setMessageText(member.details.lockMemberError);
          props.setSeverityType("error");
        });
    } else {
      // call the member unlock api
      await post(`${api.member.unlockMember}/${memberId}`)
        .then(async (res) => {
          if (isSuccessApi(res.status)) {
            await getDataMemberDetail();
            props.setMessageText(member.details.unlockMemberSuccess);
            props.setSeverityType("success");
          } else {
            props.setMessageText(res.data?.message || member.details.unlockMemberError);
            props.setSeverityType("error");
          }
        })
        .catch(() => {
          props.setMessageText(member.details.unlockMemberError);
          props.setSeverityType("error");
        });
    }
    props.setLoading(false);
  };

  // handle unlock popup or unlock member
  const setShowPopupLockMember = React.useCallback(() => {
    setIsOpenPopupLockMember(!isOpenPopupLockMember);
  }, [isOpenPopupLockMember]);

  return (
    <div className="page-content member-detail">
      <Box className="member-detail-title">
        <TitleScreen>{member.details.title}</TitleScreen>
      </Box>
      {memberDetailData && (
        <>
          <Box>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }} className="member-detail-content">
              <Grid item xs={8} className="member-detail-content-info">
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12}>
                    <Box className="fs-14-text font-weight-bold">
                      {member.details.id} {memberDetailData?.id || ""}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={memberDetailData?.status === 4 ? "form-name" : ""}>
                      <Box>
                        <Box className="fs-14-text font-weight-bold" mt={2}>{`${
                          memberDetailData?.first_name_kana || ""
                        }${memberDetailData?.last_name_kana || ""}`}</Box>
                        <Box className="fs-20-text font-weight-bold">{`${memberDetailData?.first_name || ""}${
                          memberDetailData?.last_name || ""
                        }`}</Box>
                        <a className="fs-14-text ">{memberDetailData?.email || ""}</a>
                      </Box>
                      {memberDetailData?.status === 4 && (
                        <Box className="service status-user">{member.details.statusMember}</Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="fs-14-text font-weight-bold" mt={2}>
                      {getDataAddress()}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="fs-14-text font-weight-bold">{memberDetailData?.phone_number || ""}</Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="fs-14-text font-weight-bold" mt={2}>
                      {memberDetailData?.create_at ? convertShowDate(memberDetailData?.create_at) + " 登録 / " : ""}
                      {memberDetailData?.update_at ? convertShowDate(memberDetailData?.update_at) + " 更新" : ""}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4} className="member-detail-content-service">
                <Box className="form-service">
                  <Box
                    className={`service ${
                      memberDetailData?.user_type === 2 || memberDetailData?.user_type === 4
                        ? "service-use"
                        : "service-not-use"
                    }`}
                  >
                    {member.details.buttonEventOrganizationService}
                  </Box>
                  <Box
                    className={`service ${
                      memberDetailData?.user_type === 3 || memberDetailData?.user_type === 4
                        ? "service-use"
                        : "service-not-use"
                    }`}
                    mt={4}
                  >
                    {member.details.buttonLocalNewsStreamingService}
                  </Box>
                  <Box
                    className={`service ${memberDetailData?.user_type === 5 ? "service-use" : "service-not-use"}`}
                    mt={4}
                  >
                    {member.details.buttonLocalCurrencyService}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box className="button-action" mt={5}>
            <Box mr={1} className="button-back-list-member">
              <ButtonComponent name={member.details.buttonGoToBackListMember} handleClick={goToBackListMember} />
            </Box>
            <Box className={memberDetailData?.status !== 4 ? "button-lock-member" : "button-unlock-member"}>
              <ButtonComponent
                disable={memberDetailData?.status === 1 || memberDetailData?.status === 3}
                name={
                  memberDetailData?.status !== 4 ? member.details.buttonLockMember : member.details.buttonUnlockMember
                }
                handleClick={showPopupLockMember}
              />
            </Box>
          </Box>
          <OverLay isOpen={isOpenPopupLockMember} setIsOpen={setShowPopupLockMember}>
            <Box>
              <Box mb={3} mt={3} sx={{ color: "black" }} className="fs-12-text">
                {memberDetailData?.status !== 4 ? member.details.confirmLockMember : member.details.confirmUnlockMember}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box mr={1} className="background-cancel-reg">
                  <ButtonComponent name={commonText.buttonCancel} handleClick={setShowPopupLockMember} />
                </Box>
                <ButtonComponent
                  name={
                    memberDetailData?.status !== 4 ? member.details.buttonLockMember : member.details.buttonUnlockMember
                  }
                  handleClick={handleUpdateStatusMember}
                />
              </Box>
            </Box>
          </OverLay>
        </>
      )}
    </div>
  );
};

const mapDispatchToProps = { setLoading, setMessageText, setSeverityType };

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MemberDetail);
