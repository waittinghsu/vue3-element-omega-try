// types/index.ts

export enum QueryType {
  Search = "search",
  Reset = "reset",
}

export interface ChoiceBaseItem {
  id: string | number;
  name: string;
}

export type Choices = {
  status: ChoiceBaseItem[];
  product: ChoiceBaseItem[];
  user: ChoiceBaseItem[];
  userDic: Record<string, string>;
};

export interface QueryParams {
  pageNum: number;
  pageSize: number;
  keywords: string;
  status: string;
}

export interface EmitPayload {
  type: QueryType;
  queryParams: QueryParams;
}
