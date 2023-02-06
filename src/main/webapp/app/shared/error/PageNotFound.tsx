import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import ButtonComponent from "app/modules/commons/Button";
import router from "app/routes/router";

export const PageNotFound = () => {
  const history = useHistory();

  const goHome = useCallback(() => {
    history.push(router.topPage);
  }, []);

  return (
    <div className="page-notfound">
      <div className="top">
        <h1>404</h1>
        <h3>page not found</h3>
      </div>
      <div className="bottom">
        <div className="buttons">
          <ButtonComponent name="戻る" handleClick={goHome} />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
