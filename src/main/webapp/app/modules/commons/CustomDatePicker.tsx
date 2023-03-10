/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-shadow */
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import commonText from "app/lang/ja/commonText";
import clsx from "clsx";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState } from "react";

export const CustomDatePicker = (props: any) => {
  const classes = useStyle();
  const [date, setDate] = useState(null);

  React.useLayoutEffect(() => {
    setDate(props.value);
  }, [props.value]);

  const handleChange = React.useCallback(
    (value) => {
      let newDate = null;
      if (value) {
        newDate = new Date(value).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
      }
      setDate(newDate);
      setTimeout(() => {
        props.handleChangeDate(newDate, props.fieldName);
      }, 500);
    },
    [props]
  );

  const checkMinDate = () => {
    if (!props.minDate || props.minDate.toString() === "Invalid date") {
      return undefined;
    } else return new Date(props.minDate);
  };

  const checkMaxDate = () => {
    if (!props.maxDate || props.maxDate.toString() === "Invalid date") {
      return undefined;
    } else return new Date(props.maxDate);
  };

  return (
    <MuiPickersUtilsProvider utils={JaLocalizedUtils} locale={ja}>
      <KeyboardDatePicker
        className={`${clsx(classes.datePick)} date-time-value fs-14-text`}
        id="time-picker"
        value={date ? new Date(date) : null}
        onChange={handleChange}
        placeholder="yyyy/mm/dd"
        format="yyyy/MM/dd"
        invalidDateMessage={false}
        minDate={checkMinDate()}
        maxDate={checkMaxDate()}
        helperText={null}
        autoOk={false}
        cancelLabel={commonText.buttonCancel}
      />
    </MuiPickersUtilsProvider>
  );
};

const useStyle = makeStyles((theme) => {
  return {
    datePick: {
      width: "100%",
      outline: "none !important",
      border: "1px solid #d1d1d1",
      backgroundColor: "white",
      "& .MuiInputBase-input": {
        padding: "7px 0 7px 5px",
      },
      "& .MuiIconButton-root": {
        padding: 7,
        paddingRight: 11,
      },
      "& .MuiInputBase-root": {
        "&.MuiInput-underline:hover:before": {
          border: "none",
        },
      },
      "& .MuiInput-underline:before": {
        border: "none",
      },
      "& .MuiInput-underline:after": {
        border: "none",
      },
    },
  };
});

// ??????Utils
class JaLocalizedUtils extends DateFnsUtils {
  // ???????????????????????????????????????????????????????????????????????????
  getCalendarHeaderText(date: Date) {
    return format(new Date(getDateJP(date)), "yyyy???M???", { locale: this.locale });
  }

  // ?????????????????????????????????????????????????????????
  getDateTimePickerHeaderText(date: Date) {
    return format(new Date(getDateJP(date)), "M???d???", { locale: this.locale });
  }

  // ??????????????????????????????????????????????????????
  getYearText = (date: Date): string => {
    const seireki = date.getFullYear();
    return seireki + "???";
  };
}

const getDateJP = (date: any) => {
  return new Date(date);
};
