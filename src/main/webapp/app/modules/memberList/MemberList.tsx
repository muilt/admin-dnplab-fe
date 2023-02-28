import Box from "@material-ui/core/Box";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import event from "app/lang/ja/event";
import member from "app/lang/ja/member";
import api from "app/routes/api";
import router from "app/routes/router";
import { setLoading, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { convertDataDate } from "app/shared/util/convertDate";
import { get } from "app/shared/util/service";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { PaginationList } from "../commons/pagination/PaginationList";
import { TitleScreen } from "../commons/TitleScreen";
import { createSearchQuery, makeMultiSearchQuery, makeSearchQuery } from "../eventList/createSearchQuery";
import FormSearchMember from "./FormSearchMember";

const formValuesSearch = {
  id: "",
  name: "",
  name_kana: "",
  email: "",
};

const MemberList = (props) => {
  const [listMember, setListMember] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const history = useHistory();
  const [dataSort, setDataSort] = React.useState([]);
  const [dataSearch, setDataSearch] = React.useState(formValuesSearch);
  const [isSearch, setIsSearch] = React.useState(false);
  const headerTable = {
    id: member.list.header.id,
    name: member.list.header.name,
    name_kana: member.list.header.name_kana,
    email: member.list.header.email,
    user_type: member.list.header.user_type,
    create_at: member.list.header.create_at,
  };

  let paramSearch = dataSearch;

  React.useEffect(() => {
    if (isSearch) {
      getListMember(dataSort);
    }
    return () => {
      setListMember([]);
    };
  }, [isSearch, currentPage]);

  // call api get list member
  const getListMember = React.useCallback(
    async (data: any) => {
      props.setLoading(true);
      let query = "";
      query += makeSearchQuery("page", currentPage);
      if (data?.length > 0) {
        query += makeMultiSearchQuery("sort[]", data);
      }

      Object.keys(paramSearch).forEach((key) => {
        if (paramSearch[key]) {
          const dataItemSearch =
            key === "email"
              ? encodeURIComponent(paramSearch[key]?.toLowerCase())
              : encodeURIComponent(paramSearch[key]);
          query += makeSearchQuery(key, dataItemSearch);
        }
      });

      if (query) {
        query = createSearchQuery(query);
      }
      await handleGetListMember(query);
      setTimeout(() => {
        props.setLoading(false);
      }, 200);
    },
    [currentPage, dataSort, paramSearch]
  );

  // call api get list member
  const handleGetListMember = async (param) => {
    await get(`${api.member.getListMember}?${param}`)
      .then((res) => {
        if (res.data?.data) {
          setDataListMember(res.data.data);
        } else {
          setListMember([]);
        }
        setTotalPage(res.data?.total_page || 0);
        setCurrentPage(res.data?.current_page || 1);
        setTotalCount(res.data?.total_count || 0);
      })
      .catch(() => {
        setListMember([]);
        setTotalPage(0);
        setCurrentPage(1);
        setTotalCount(0);
      });
  };

  // set the value of list member
  const setDataListMember = (listData) => {
    const listDataMember = [];
    listData.forEach((data) => {
      const dataItem = {
        id: data?.id,
        name: data?.name,
        name_kana: data?.name_kana,
        email: data?.email,
        user_type: getServiceUse(data?.user_type),
        create_at: data?.create_at,
      };
      listDataMember.push(dataItem);
    });
    setListMember(listDataMember);
  };

  // get service use
  const getServiceUse = (data) => {
    if (data === 2) {
      return member.list.eventOrganizer;
    } else if (data === 3) {
      return member.list.ambassador;
    } else if (data === 4) {
      return `${member.list.eventOrganizer + "\n"}${member.list.ambassador}`;
    } else return "";
  };

  // handle pagination
  const handleChangePage = React.useCallback(
    (page) => {
      setIsSearch(true);
      setCurrentPage(page);
    },
    [currentPage, isSearch]
  );

  // go to member detail
  const redirectMemberDetail = React.useCallback((id) => {
    history.push(`${router.memberDetail}${id}`);
  }, []);

  // handle click button search
  const handleSearch = React.useCallback(
    async (data: any) => {
      setCurrentPage(1);
      setDataSort([]);
      paramSearch = data;
      setDataSearch(data);
      await getListMember([]);
    },
    [paramSearch, dataSearch]
  );

  // handle sort
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  const handleRequestSort = (property) => {
    let newDataSort = [];
    const sort = dataSort.find((data) => data.column === property);
    if (sort) {
      newDataSort = dataSort.filter((data) => data.column !== property);
      newDataSort.push({
        column: property,
        type: sort.type === "asc" ? "desc" : "asc",
      });
    } else {
      newDataSort = [
        {
          column: property,
          type: "asc",
        },
      ];
    }
    setDataSort(newDataSort);
    getListMember(newDataSort);
  };

  // active sort columns
  const checkActiveColumnSort = (column) => {
    const sort = dataSort.find((data) => data.column === column);
    if (sort) {
      return true;
    } else return false;
  };

  // check type sort
  const checkDirectionColumnSort = (column, type) => {
    const sort = dataSort.find((data) => data.column === column);
    if (sort) {
      return sort.type;
    } else {
      if (type === 1) {
        return false;
      } else return "asc";
    }
  };

  const getValueOfColumn = (column, row, value) => {
    const checkColumnName = column === "name" || column === "name_kana";
    return (
      <TableCell key={column} className="fs-14-text pointer" onClick={() => redirectMemberDetail(row.id)}>
        <div style={{ maxWidth: checkColumnName ? 190 : "auto" }}>{value}</div>
      </TableCell>
    );
  };

  return (
    <div>
      <Box className="page-content member-list">
        <TitleScreen>{member.list.title}</TitleScreen>
        <FormSearchMember handleSearchMember={handleSearch} />
        <Box className="event-list-sort">
          <Box textAlign={"right"} className="fs-14-text">
            全{totalCount || 0}件
          </Box>
          {totalPage > 0 && (
            <Box mt={2} textAlign="right" className="event-list-paging">
              <PaginationList page={currentPage} totalPage={totalPage} handleChangePage={handleChangePage} />
            </Box>
          )}
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"} className="member-list-table">
            <TableHead className="table-header">
              <TableRow>
                {Object.keys(headerTable).map((column) => (
                  <TableCell
                    key={column}
                    className={`fs-14-text ${column === "id" ? "item-id" : ""}`}
                    sortDirection={checkDirectionColumnSort(column, 1)}
                  >
                    {column !== "name" && column !== "name_kana" && column !== "email" ? (
                      <TableSortLabel
                        active={checkActiveColumnSort(column)}
                        direction={checkDirectionColumnSort(column, 2)}
                        onClick={createSortHandler(column)}
                      >
                        {headerTable[column]}
                      </TableSortLabel>
                    ) : (
                      headerTable[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {listMember?.length > 0 ? (
              <TableBody className="table-body">
                {listMember.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      className={`${index % 2 === 0 ? "row-grey" : "row-light"}`}
                    >
                      {Object.keys(headerTable).map((column) => {
                        let value = row[column] || "";
                        if (column === "create_at") {
                          let newDate = value;
                          const regex = /[a-zA-Z]$/;
                          if (regex.test(value)) {
                            newDate = value.slice(0, value?.length - 1);
                          }
                          value = newDate ? convertDataDate(newDate) : "";
                        }
                        return getValueOfColumn(column, row, value);
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableRow key="no data">
                <TableCell
                  colSpan={Object.keys(headerTable)?.length}
                  align="center"
                  key="column data"
                  className="fs-14-text"
                  style={{ backgroundColor: "white" }}
                >
                  {event.textNodata}
                </TableCell>
              </TableRow>
            )}
          </Table>
        </TableContainer>
        {totalPage > 0 && (
          <Box mt={2} textAlign="right" className="event-list-paging">
            <PaginationList page={currentPage} totalPage={totalPage} handleChangePage={handleChangePage} />
          </Box>
        )}
      </Box>
    </div>
  );
};

const mapDispatchToProps = { setLoading, setMessageText, setSeverityType };

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MemberList);
