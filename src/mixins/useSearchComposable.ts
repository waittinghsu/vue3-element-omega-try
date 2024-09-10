import { PropType, computed, defineEmits } from "vue";

export enum QueryType {
  Search = "search",
  Reset = "reset",
  Refresh = "refresh",
}

export interface EmitPayload<TQueryParams> {
  type: QueryType;
  listQuery: TQueryParams;
}

export interface SearchContainerEmits<TQueryParams> {
  (e: "handleSearch", payload: EmitPayload<TQueryParams>): void;
  (e: "handleRefresh", payload: EmitPayload<TQueryParams>): void;
  (e: "update:listQuery", payload: TQueryParams): void;
  // (e: "handlePageChange", payload: { value: object }): void;
}

export const searchContainerProps = <
  TChoices,
  TQueryParams extends PageQuery,
>() => ({
  listQuery: {
    type: Object as PropType<TQueryParams>,
    required: true,
    default: (): TQueryParams =>
      ({
        pageNum: 1,
        pageSize: 10,
        ...({} as Omit<TQueryParams, keyof PageQuery>),
      }) as TQueryParams,
  },
  choices: {
    type: Object as PropType<TChoices>,
    required: true,
  },
});

export const useListQueryProxy = <TQueryParams extends PageQuery>(
  listQuery: TQueryParams,
  emit: (event: "update:listQuery", payload: TQueryParams) => void
) => {
  return computed<TQueryParams>({
    get: () => listQuery as TQueryParams,
    set: (value: TQueryParams) => {
      emit("update:listQuery", value);
    },
  });
};

export const useSearchComposable = <TQueryParams extends PageQuery>(
  listQueryProxy: ReturnType<typeof useListQueryProxy<TQueryParams>>,
  emit: (event: "handleSearch", payload: EmitPayload<TQueryParams>) => void,
  queryFormRef: { value: InstanceType<typeof ElForm> | null }
) => {
  const handleQuery = () => {
    emit("handleSearch", {
      type: QueryType.Search,
      listQuery: listQueryProxy.value,
    });
  };
  const handleResetQuery = () => {
    queryFormRef.value?.resetFields();
    listQueryProxy.value.pageNum = 1;
    emit("handleSearch", {
      type: QueryType.Reset,
      listQuery: listQueryProxy.value,
    });
  };

  return {
    handleQuery,
    handleResetQuery,
  };
};
