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
  group: ChoiceBaseItem[];
  user: ChoiceBaseItem[];
  userDic: Record<string, string>;
};

export interface QueryParams {
  pageNum: number;
  pageSize: number;
  keywords: string;
  group: number | null;
  status: number | null;
}

export interface EmitPayload {
  type: QueryType;
  listQuery: QueryParams;
}
