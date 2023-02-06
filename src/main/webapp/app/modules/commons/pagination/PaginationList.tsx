import Box from "@material-ui/core/Box";
import MuiPagination from "@material-ui/lab/Pagination";
import React from "react";

export const PaginationList = (props: any) => {
  const [page, setPage] = React.useState(props.page);
  const { totalPage } = props;

  const dispatchChangePage = React.useCallback((_: any, value: any) => {
    setPage(value);
    props.handleChangePage(value);
  }, []);

  return (
    <Box display="flex" justifyContent="center" mb={5}>
      <MuiPagination page={page} onChange={dispatchChangePage} count={totalPage} variant="outlined" shape="rounded" />
    </Box>
  );
};
