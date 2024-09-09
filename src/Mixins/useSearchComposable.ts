import { PropType, computed } from "vue";

export interface BaseQuery {
  pageNum: number;
  pageSize: number;
  total: number;
}

export const searchDefaultProps = <C, Q extends BaseQuery>() => ({
  listQuery: {
    type: Object as () => PropType<Q>,
    required: true,
    default: (): Q =>
      ({
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ...({} as Omit<Q, keyof BaseQuery>),
      }) as Q,
  },
  choices: {
    type: Object as PropType<C>,
    required: true,
  },
});

export const useListQueryProxy = <Q extends BaseQuery>(
  listQuery: Q,
  emit: (event: "update:listQuery", payload: Q) => void
) => {
  return computed<Q>({
    get: () => listQuery,
    set: (value: Q) => {
      emit("update:listQuery", value);
    },
  });
};

// // 將 computed 邏輯封裝在一個函數中，供其他組件使用
// export const useComputedListQueryProxy = <Q>(props) => {
//   return computed(() => `Hello, ${props.message}`);
// };
//
// // 將 method 封裝在一個函數中，供其他組件使用
// export const handleSubmit = (props, emit) => {
//   const submit = () => {
//     emit("customEvent", props.message);
//   };
//   return {
//     submit,
//   };
// };
