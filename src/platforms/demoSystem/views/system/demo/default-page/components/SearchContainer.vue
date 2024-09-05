<template>
  <div class="search-container">
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="keywords" label="关键字">
            <el-input
              v-model="queryParams.keywords"
              placeholder="角色名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="全部"
              clearable
              class="!w-[100px]"
            >
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="handleQuery('search')">
          <i-ep-search />
          搜索
        </el-button>
        <el-button @click="handleQuery('reset')">
          <i-ep-refresh />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "SearchContainer",
  inheritAttrs: false,
});
const emit = defineEmits(["handleSearch"]);
const queryFormRef = ref(ElForm);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keywords: "",
  status: "",
});
const handleQuery = (type = "search") => {
  emit("handleSearch", { type: type, queryParams });
};
</script>

<style scoped lang="scss"></style>
