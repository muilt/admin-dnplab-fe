class PaginationOutputModel<T> {
  page_number: number;
  totalPages: number;
  page_size: number;
  total: number;
  data: T;
  keyword: string | undefined;
  start_date?: string;
  end_date?: string;
  constructor(input: PaginationOutputModel<T>) {
    this.page_number = input.page_number;
    this.totalPages = input.totalPages;
    this.page_size = input.page_size;
    this.total = input.total;
    this.data = input.data;
    this.keyword = input.keyword;
    return this;
  }
}

export default PaginationOutputModel;
