<template>
  <div class="search-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="keywords" label="关键字">
            <el-input
              v-model="queryParams.keywords"
              placeholder="角色名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="全部"
              clearable
            >
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col class="text-right" :span="24">{{ choices }}}</el-col>
      <el-col class="text-right" :span="24">
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <i-ep-refresh />
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { QueryType } from "../types";
import type { Choices, QueryParams, EmitPayload } from "../types";
defineOptions({
  name: "SearchContainer",
  inheritAttrs: false,
});

defineProps({
  choices: {
    type: Object as () => Choices,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "handleSearch", payload: EmitPayload): void;
  (e: "handleChange", payload: { value: string }): void;
  (e: "handleError", payload: { error: string }): void;
}>();

const queryFormRef = ref(ElForm);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  status: "",
});

function handleQuery() {
  emit("handleSearch", { type: QueryType.Search, queryParams });
}

function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  emit("handleSearch", { type: QueryType.Reset, queryParams });
}
</script>

<style scoped lang="scss"></style>
