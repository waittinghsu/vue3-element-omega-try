export enum QueryType {
  Search = "search",
  Reset = "reset",
}

export interface ChoiceBaseItem {
  id: string | number;
  name: string;
}

// 這裡是Choices根據需求修改添加
export type Choices = {
  status: ChoiceBaseItem[];
  product: ChoiceBaseItem[];
  group: ChoiceBaseItem[];
  user: ChoiceBaseItem[];
  userDic: Record<string, string>;
};
// 這裡是搜尋條件根據需求修改添加
export interface QueryParams extends PageQuery {
  keywords?: string;
  group?: number | null;
  dept?: number | null;
  status?: number | null;
}
