import {
  linkPortal,
  linkPortalCookie,
  linkPortalHelp,
  linkPortalPrivacyPolicy,
  linkPortalSitePolicy
} from "app/config/constants";
import commonText from "app/lang/ja/commonText";
import headerFooter from "app/lang/ja/headerFooter";
import router from "app/routes/router";
import { IRootState } from "app/shared/reducers";
import { isMobile } from "app/shared/reducers/authentication";
import React from "react";
import { connect } from "react-redux";

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer__inner">
        <div className="footer__info">
          <div className="logo">
            <a href={linkPortal} rel="noreferrer" target="_blank" style={{ color: "inherit" }}>
              <img src={"/content/images/logo_foot.png"} alt={headerFooter.altLogo} />
            </a>
          </div>
          <p className={`txt ${isMobile ? "fs-14-text" : "fs-16-text"}`}>{headerFooter.txtText}</p>
        </div>
        <div className="footer__nav">
          <div className="pc-only">
            <ul className="nav__list">
              <li className="nav_list_li">
                <a href={router.event} style={{ color: "inherit" }} className={isMobile ? "fs-14-text" : "fs-16-text"}>
                  {commonText.linksHeader.linkEventList}
                </a>
              </li>
              <li>
                <a
                  href={linkPortalHelp}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                  className={isMobile ? "fs-14-text" : "fs-16-text"}
                >
                  {headerFooter.linkSupportTerm}
                </a>
              </li>
              <li>
                <a
                  href={linkPortalPrivacyPolicy}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                  className={isMobile ? "fs-14-text" : "fs-16-text"}
                >
                  {headerFooter.linkPrivacyPolicy}
                </a>
              </li>
              <li>
                <a
                  href={linkPortalCookie}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                  className={isMobile ? "fs-14-text" : "fs-16-text"}
                >
                  {headerFooter.linkPortalCookie}
                </a>
              </li>
              <li>
                <a
                  href={linkPortalSitePolicy}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit" }}
                  className={isMobile ? "fs-14-text" : "fs-16-text"}
                >
                  {headerFooter.linkPortalSitePolicy}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__flex">
            {isMobile && (
              <>
                <p className="privacy event-mobile">
                  <a href={router.event} style={{ color: "inherit" }} className="fs-16-text">
                    {commonText.linksHeader.linkEventList}
                  </a>
                </p>
                <p className="privacy event-mobile">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={linkPortalHelp}
                    style={{ color: "inherit" }}
                    className="fs-16-text"
                  >
                    {headerFooter.linkSupportTerm}
                  </a>
                </p>
                <p className="privacy event-mobile">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={linkPortalPrivacyPolicy}
                    style={{ color: "inherit" }}
                    className="fs-16-text"
                  >
                    {headerFooter.linkPrivacyPolicy}
                  </a>
                </p>
                <p className="privacy event-mobile">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={linkPortalCookie}
                    style={{ color: "inherit" }}
                    className="fs-16-text"
                  >
                    {headerFooter.linkPortalCookie}
                  </a>
                </p>
                <p className="privacy event-mobile">
                  <a
                    href={linkPortalSitePolicy}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "inherit" }}
                    className="fs-16-text"
                  >
                    {headerFooter.linkPortalSitePolicy}
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="copyright">{headerFooter.textCopyRight}</p>
    </footer>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isMobile: authentication.isMobile,
});

export default connect(mapStateToProps)(Footer);
