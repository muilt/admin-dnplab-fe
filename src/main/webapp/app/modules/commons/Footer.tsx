import {
  linkPortal
} from "app/config/constants";
import headerFooter from "app/lang/ja/headerFooter";
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
      </div>
      <p className="copyright">{headerFooter.textCopyRight}</p>
    </footer>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isMobile: authentication.isMobile,
});

export default connect(mapStateToProps)(Footer);
