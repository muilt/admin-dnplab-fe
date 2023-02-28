import Box from "@material-ui/core/Box";
import { Grid, TextField } from "@mui/material";
import event from "app/lang/ja/event";
import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import ButtonComponent from "../commons/Button";
import { CustomDatePicker } from "../commons/CustomDatePicker";

type inputError = {
  start_period: string | null;
  end_period: string | null;
  show_start: string | null;
  show_end: string | null;
  update_start: string | null;
  update_end: string | null;
};

const dataDate = ["start_period", "end_period", "show_start", "show_end", "update_start", "update_end"];

const FormSearchEvent = (props) => {
  let errors = null;
  let listKeyError = [];
  const [dataSearch, setDataSearch] = React.useState({
    title: "",
    start_period: "",
    end_period: "",
    show_start: "",
    show_end: "",
    update_start: "",
    update_end: "",
  });
  const [error, setError] = React.useState<inputError>({
    start_period: "",
    end_period: "",
    show_start: "",
    show_end: "",
    update_start: "",
    update_end: "",
  });

  // handle search event
  const handleSubmitSearch = React.useCallback(() => {
    checkValidateInputDate();
    if (listKeyError?.length <= 0) {
      props.handleSearchEvent(dataSearch);
      listKeyError = [];
      errors = dataSearch;
    }
  }, [dataSearch]);

  // handle when the date value changes
  const handleChangeDate = React.useCallback(
    (data: any, fieldName: any) => {
      setDataSearch({
        ...dataSearch,
        [fieldName]: data ? moment(data).format("yyyy-MM-DD") : null,
      });
    },
    [dataSearch]
  );

  // handle when the value in the search box changes
  const handleChangeText = React.useCallback(
    (e) => {
      const { value, name } = e.target;
      setDataSearch({
        ...dataSearch,
        [name]: value,
      });
    },
    [dataSearch]
  );

  // check validate input date
  const checkValidateInputDate = () => {
    listKeyError = [];
    errors = null;
    Object.keys(dataSearch).forEach((key) => {
      if (dataDate.includes(key) && dataSearch[key]) {
        const checkDateValid = moment(dataSearch[key]).isValid();
        if (!checkDateValid) {
          listKeyError.push(key);
          errors = { ...errors, [key]: event.list.search.dateNotInValid };
        }
      }
      checkValidatePeriodDate(key);
    });
    setError(errors);
  };

  // check validate period date
  const checkValidatePeriodDate = (key) => {
    if (key === "start_period" && dataSearch[key] && dataSearch.end_period) {
      const checkPeriodDate = new Date(dataSearch?.start_period) > new Date(dataSearch?.end_period);
      if (checkPeriodDate) {
        listKeyError.push(key);
        errors = { ...errors, [key]: event.list.search.errorStartDate };
      }
    }
    if (key === "show_start" && dataSearch[key] && dataSearch.show_end) {
      const checkShowDate = new Date(dataSearch?.show_start) > new Date(dataSearch?.show_end);
      if (checkShowDate) {
        listKeyError.push(key);
        errors = { ...errors, [key]: event.list.search.errorStartDate };
      }
    }
    if (key === "update_start" && dataSearch[key] && dataSearch.update_end) {
      const checkUpdateDate = new Date(dataSearch?.update_start) > new Date(dataSearch?.update_end);
      if (checkUpdateDate) {
        listKeyError.push(key);
        errors = { ...errors, [key]: event.list.search.errorStartDate };
      }
    }
  };

  // handle removing terminal white characters
  const handleSetValue = React.useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setDataSearch({
        ...dataSearch,
        [name]: value ? value.trim() : "",
      });
    },
    [dataSearch]
  );

  return (
    <div className="form-search-event">
      <Box className="fs-20-text font-weight-bold" mb={1}>
        {event.list.titleFormSearch}
      </Box>
      <Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="form-search-event-content">
          <Grid item xs={5.5} className="text-input">
            <Box className="input-title fs-14-text">{event.list.search.title}</Box>
            <TextField
              inputProps={{
                maxLength: 100,
              }}
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="input-textfield fs-14-text"
              name="title"
              value={dataSearch?.title || ""}
              onChange={handleChangeText}
              onBlur={handleSetValue}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "0px !important" }} className="text-input">
            <Box className="input-title fs-14-text">{event.list.search.holdTime}</Box>
          </Grid>
          <Grid item xs={5.5} className="input-date text-input">
            <CustomDatePicker
              fieldName="start_period"
              handleChangeDate={handleChangeDate}
              value={dataSearch.start_period || ""}
              maxDate={dataSearch.end_period}
            />
            {error?.start_period && <p className="error-message fs-14-text">{error?.start_period}</p>}
          </Grid>
          <Grid item xs={1} className="input-date">
            <Box textAlign={"center"} alignItems="center">
              ~
            </Box>
          </Grid>
          <Grid item xs={5.5} className="input-date">
            <CustomDatePicker
              fieldName="end_period"
              handleChangeDate={handleChangeDate}
              value={dataSearch.end_period || ""}
              minDate={dataSearch.start_period}
            />
            {error?.end_period && <p className="error-message fs-14-text">{error?.end_period}</p>}
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "0px !important" }} className="text-input">
            <Box className="input-title fs-14-text">{event.list.search.publicTime}</Box>
          </Grid>
          <Grid item xs={5.5} className="input-date text-input">
            <CustomDatePicker
              fieldName="show_start"
              handleChangeDate={handleChangeDate}
              value={dataSearch.show_start || ""}
              maxDate={dataSearch.show_end}
            />
            {error?.show_start && <p className="error-message fs-14-text">{error?.show_start}</p>}
          </Grid>
          <Grid item xs={1} className="input-date">
            <Box textAlign={"center"} alignItems="center">
              ~
            </Box>
          </Grid>
          <Grid item xs={5.5} className="input-date">
            <CustomDatePicker
              fieldName="show_end"
              handleChangeDate={handleChangeDate}
              value={dataSearch.show_end || ""}
              minDate={dataSearch.show_start}
            />
            {error?.show_end && <p className="error-message fs-14-text">{error?.show_end}</p>}
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "0px !important" }} className="text-input">
            <Box className="input-title fs-14-text">{event.list.search.updateDate}</Box>
          </Grid>
          <Grid item xs={5.5} className="input-date text-input">
            <CustomDatePicker
              fieldName="update_start"
              handleChangeDate={handleChangeDate}
              value={dataSearch.update_start || ""}
              maxDate={dataSearch.update_end}
            />
            {error?.update_start && <p className="error-message fs-14-text">{error?.update_start}</p>}
          </Grid>
          <Grid item xs={1} className="input-date">
            <Box textAlign={"center"} alignItems="center">
              ~
            </Box>
          </Grid>
          <Grid item xs={5.5} className="input-date">
            <CustomDatePicker
              fieldName="update_end"
              handleChangeDate={handleChangeDate}
              value={dataSearch.update_end || ""}
              minDate={dataSearch.update_start}
            />
            {error?.update_end && <p className="error-message fs-14-text">{error?.update_end}</p>}
          </Grid>
        </Grid>
      </Box>
      <Box className="button-search">
        <ButtonComponent name={event.list.buttonSearchEvent} handleClick={handleSubmitSearch} />
      </Box>
    </div>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FormSearchEvent);
