export const ITEMS_PER_PAGE = 20;

export type subMenuModel = {
  key: string;
  path: {
    [key: string]: string;
  };
  title: string;
  groups: string[];
};

export type routeModel = {
  key: string;
  path: {
    [key: string]: string;
  };
  title: string;
  component: any;
  role: string[];
};

export const IS_ORGANIZER = "IS_ORGANIZER"
export const LOGIN = "LOGIN"
