import Box from "@material-ui/core/Box";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import event from "app/lang/ja/event";
import api from "app/routes/api";
import router from "app/routes/router";
import { setLoading, setMessageText, setSeverityType } from "app/shared/reducers/authentication";
import { convertDateTime } from "app/shared/util/convertDate";
import { get } from "app/shared/util/service";
import * as React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { PaginationList } from "../commons/pagination/PaginationList";
import { TitleScreen } from "../commons/TitleScreen";
import { createSearchQuery, makeMultiSearchQuery, makeSearchQuery } from "./createSearchQuery";
import FormSearchEvent from "./FormSearchEvent";

const formValuesSearch = {
  title: "",
  start_period: "",
  end_period: "",
  show_start: "",
  show_end: "",
  update_start: "",
  update_end: "",
};

const EventList = (props) => {
  const [listEvent, setListEvent] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const history = useHistory();
  const [dataSort, setDataSort] = React.useState([]);
  const [dataSearch, setDataSearch] = React.useState(formValuesSearch);
  const headerTable = {
    id: event.list.header.id,
    title: event.list.header.title,
    organizer: event.list.header.organizer,
    start_period: event.list.header.startPeriod,
    end_period: event.list.header.endPeriod,
    show_start: event.list.header.showStart,
    show_end: event.list.header.showEnd,
    updated_at: event.list.header.updateDate,
  };

  let paramSearch = dataSearch;

  // handle get list event
  const getEventList = React.useCallback(
    async (data: any) => {
      props.setLoading(true);
      let query = "";
      query += makeSearchQuery("page", currentPage);
      if (data?.length > 0) {
        query += makeMultiSearchQuery("sort[]", data);
      }

      Object.keys(paramSearch).forEach((key) => {
        if (paramSearch[key]) {
          if (key === "title") {
            query += makeSearchQuery(key, encodeURIComponent(paramSearch[key]));
          } else {
            query += makeSearchQuery(key, paramSearch[key]);
          }
        }
      });

      if (query) {
        query = createSearchQuery(query);
      }
      await getListEvent(query);
      setTimeout(() => {
        props.setLoading(false);
      }, 200);
    },
    [currentPage, dataSort, paramSearch]
  );

  // call api get list event
  const getListEvent = async (param) => {
    await get(`${api.event.getListEvent}?${param}`)
      .then((res) => {
        if (res.data?.data) {
          setListEvent(res.data?.data || []);
        } else {
          setListEvent([]);
          setTotalPage(0);
          setCurrentPage(1);
          setTotalCount(0);
        }
        setTotalPage(res.data?.total_page || 0);
        setCurrentPage(res.data?.current_page || 1);
        setTotalCount(res.data?.total_count || 0);
      })
      .catch(() => {
        setListEvent([]);
        setTotalPage(0);
        setCurrentPage(1);
        setTotalCount(0);
      });
  };

  // handle pagination
  const handleChangePage = React.useCallback(
    (page) => {
      setCurrentPage(page);
    },
    [currentPage]
  );

  React.useEffect(() => {
    getEventList(dataSort);
    return () => {
      setListEvent([]);
    };
  }, [currentPage]);

  // go to member detail
  const redirectMemberDetail = React.useCallback((id) => {
    history.push(`${router.memberDetail}${id}`);
  }, []);

  // go to event detail
  const redirectEventDetail = React.useCallback((id) => {
    history.push(`${router.eventDetail}${id}`);
  }, []);

  // handle click button search
  const handleSearch = React.useCallback(
    async (data: any) => {
      setCurrentPage(1);
      setDataSort([]);
      paramSearch = data;
      setDataSearch(data);
      await getEventList([]);
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
    getEventList(newDataSort);
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

  // show values column
  const getValue = (row, column) => {
    const value = row[column] || "";
    const checkRedirectDetail = column === "id" || column === "title" || column === "organizer";
    if (!checkRedirectDetail) {
      let newDate = value;
      const regex = /[a-zA-Z]$/;
      if (regex.test(value)) {
        newDate = value.slice(0, value?.length - 1);
      }
      return (
        <TableCell key={column} className="fs-14-text">
          {newDate ? convertDateTime(newDate) : ""}
        </TableCell>
      );
    } else {
      return (
        <TableCell
          key={column}
          className="fs-14-text pointer"
          onClick={() => {
            if (column === "organizer") {
              redirectMemberDetail(row?.organizer_id);
            } else {
              redirectEventDetail(row?.id);
            }
          }}
        >
          {value}
        </TableCell>
      );
    }
  };

  return (
    <div className="event-list page-content">
      <Box className="event-list-title">
        <TitleScreen>{event.list.title}</TitleScreen>
      </Box>
      <FormSearchEvent handleSearchEvent={handleSearch} />
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
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table" className="event-list-table">
          <TableHead className="table-header">
            <TableRow>
              {Object.keys(headerTable).map((column) => (
                <TableCell
                  key={column}
                  className={`fs-14-text ${column === "id" ? "item-id" : ""}`}
                  sortDirection={checkDirectionColumnSort(column, 1)}
                >
                  {column !== "title" && column !== "organizer" ? (
                    <TableSortLabel
                      active={checkActiveColumnSort(column)}
                      direction={checkDirectionColumnSort(column, 2)}
                      onClick={createSortHandler(column)}
                    >
                      <div dangerouslySetInnerHTML={{ __html: headerTable[column].replace(/\n/g, "<br/>") }} />
                    </TableSortLabel>
                  ) : (
                    headerTable[column]
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {listEvent?.length > 0 ? (
            <TableBody className="table-body">
              {listEvent.map((row, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    className={`${i % 2 === 0 ? "row-grey" : "row-light"}`}
                  >
                    {Object.keys(headerTable).map((column) => {
                      return getValue(row, column);
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
    </div>
  );
};

const mapDispatchToProps = { setLoading, setMessageText, setSeverityType };

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
