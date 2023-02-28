import Box from "@material-ui/core/Box";
import MuiPagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import React from "react";

export const PaginationList = (props: any) => {
  let page = props.page;
  const { totalPage } = props;

  const dispatchChangePage = React.useCallback((_: any, value: any) => {
    page = value;
    props.handleChangePage(value);
  }, []);

  return (
    <Box display="flex" justifyContent="center">
      <MuiPagination
        page={page}
        onChange={dispatchChangePage}
        count={totalPage}
        variant="outlined"
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem {...item} className={item.page === page ? "page-selected" : "page-normal"} />
        )}
      />
    </Box>
  );
};
