import Box from "@material-ui/core/Box";
import { Grid, TextField } from "@mui/material";
import event from "app/lang/ja/event";
import member from "app/lang/ja/member";
import { toFullSize } from "app/shared/util/checkValidate";
import * as React from "react";
import { connect } from "react-redux";
import ButtonComponent from "../commons/Button";

const FormSearchMember = (props) => {
  const [dataSearch, setDataSearch] = React.useState({
    id: "",
    first_name_kana: "",
    last_name_kana: "",
    email: "",
  });

  // handle search member
  const handleSubmitSearch = React.useCallback(() => {
    props.handleSearchMember(dataSearch);
  }, [dataSearch]);

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

  // handle removing terminal white characters
  const handleSetValue = React.useCallback(
    (e: any) => {
      const { name, value } = e.target;
      if (name === "first_name_kana" || name === "last_name_kana") {
        const nameValue = toFullSize(value?.trim() || "");
        setDataSearch({
          ...dataSearch,
          [name]: nameValue,
        });
      } else {
        setDataSearch({
          ...dataSearch,
          [name]: value ? value.trim() : "",
        });
      }
    },
    [dataSearch]
  );

  return (
    <div className="form-search-member">
      <Box className="fs-20-text font-weight-bold" mb={1}>
        {event.list.titleFormSearch}
      </Box>
      <Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="form-search-member-content">
          <Grid item xs={5.5} className="text-input">
            <Box className="input-title fs-14-text">{member.list.search.id}</Box>
            <TextField
              inputProps={{
                maxLength: 100,
              }}
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="input-textfield fs-14-text"
              name="id"
              value={dataSearch?.id || ""}
              onChange={handleChangeText}
              onBlur={handleSetValue}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5.5}>
            <Box className="input-title fs-14-text">{member.list.search.firstNameKana}</Box>
            <TextField
              inputProps={{
                maxLength: 50,
              }}
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="input-textfield fs-14-text"
              name="first_name_kana"
              value={dataSearch?.first_name_kana || ""}
              onChange={handleChangeText}
              onBlur={handleSetValue}
            />
          </Grid>
          <Grid item xs={5.5} className="text-input">
            <Box className="input-title fs-14-text">{member.list.search.lastNameKana}</Box>
            <TextField
              inputProps={{
                maxLength: 50,
              }}
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="input-textfield fs-14-text"
              name="last_name_kana"
              value={dataSearch?.last_name_kana || ""}
              onChange={handleChangeText}
              onBlur={handleSetValue}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5.5}>
            <Box className="input-title fs-14-text">{member.list.search.email}</Box>
            <TextField
              inputProps={{
                maxLength: 200,
              }}
              id="outlined-basic"
              variant="outlined"
              size="small"
              className="input-textfield fs-14-text"
              name="email"
              value={dataSearch?.email || ""}
              onChange={handleChangeText}
              onBlur={handleSetValue}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(FormSearchMember);
