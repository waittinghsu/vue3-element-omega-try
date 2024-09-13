<template>
  <div class="search-container">
    <el-form ref="queryFormRef" :model="listQueryProxy" :inline="true">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item prop="keywords" label="关键字">
            <el-input
              v-model="listQueryProxy.keywords"
              placeholder="角色名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="listQueryProxy.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="option in choices!.status"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col class="" :span="24">
        <el-form-item class="">
          <el-button class="ml-auto" type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button class="" type="primary" plain @click="handleResetQuery">
            <i-ep-refresh />
            重置
          </el-button>
          <el-button class="mr-4" type="success" plain @click="handleRefresh">
            <i-ep-refresh-left />
            刷新
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SearchContainer",
  inheritAttrs: false,
});

import type { Choices, QueryParams } from "../types";
import type { SearchContainerEmits } from "@/mixins/useSearchComposable";
import {
  searchContainerProps,
  useListQueryProxy,
  useSearchComposable,
} from "@/mixins/useSearchComposable";
const queryFormRef = ref<InstanceType<typeof ElForm> | null>(null);

const { listQuery, choices } = defineProps({
  ...searchContainerProps<Choices, QueryParams>(),
});

const emit = defineEmits<SearchContainerEmits<QueryParams>>();

const listQueryProxy = useListQueryProxy(
  listQuery as unknown as QueryParams,
  emit
);

const { handleQuery, handleResetQuery, handleRefresh } = useSearchComposable(
  listQueryProxy,
  emit,
  queryFormRef
);
</script>

<style scoped lang="scss"></style>
