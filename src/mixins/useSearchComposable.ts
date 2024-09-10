import { PropType, computed, defineEmits } from "vue";

export interface EmitsDefaultOptions<TEmitPayload, TQueryParams> {
  (e: "handleSearch", payload: TEmitPayload): void;
  (e: "update:listQuery", payload: TQueryParams): void;
  // (e: "handlePageChange", payload: { value: object }): void;
}

export const searchDefaultProps = <
  TChoices,
  TQueryParams extends PageQuery,
>() => ({
  listQuery: {
    type: Object as () => PropType<TQueryParams>,
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
    get: () => listQuery,
    set: (value: TQueryParams) => {
      emit("update:listQuery", value);
    },
  });
};
