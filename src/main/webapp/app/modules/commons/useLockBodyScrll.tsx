import React from "react";

// コンポーネントで呼び出すとscreenをscroll不能にする
export const useLockBodyScroll = () => {
  React.useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden !important";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};
