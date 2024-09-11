<template>
  <el-dialog
    v-model="visibleProxy"
    :title="title"
    width="500px"
    @close="handleCloseDialog"
  >
    <el-form
      ref="roleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入角色名称" />
      </el-form-item>

      <el-form-item label="角色编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入角色编码" />
      </el-form-item>

      <el-form-item label="数据权限" prop="dataScope">
        <el-select v-model="formData.dataScope">
          <el-option :key="0" label="全部数据" :value="0" />
          <el-option :key="1" label="部门及子部门数据" :value="1" />
          <el-option :key="2" label="本部门数据" :value="2" />
          <el-option :key="3" label="本人数据" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">正常</el-radio>
          <el-radio :value="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          controls-position="right"
          :min="0"
          style="width: 100px"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleCloseDialog">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({
  name: "RoleEditDialog",
  inheritAttrs: false,
});
import { RoleForm } from "@/api/role";
const roleFormRef = ref(ElForm);

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const visibleProxy = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

// 角色表单
const formData = reactive<RoleForm>({
  sort: 1,
  status: 1,
  code: "omega",
  name: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
  dataScope: [{ required: true, message: "请选择数据权限", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      const roleId = formData.id;
      if (roleId) {
      } else {
      }
    }
  });
}
function handleCloseDialog() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  // formData.sort = 1;
  // formData.status = 1;
  setTimeout(() => {
    visibleProxy.value = false;
  }, 1000);
}

function setForm(newFormData: RoleForm) {
  Object.assign(formData, newFormData);
}

// 通过 defineExpose 暴露 setForm 方法
defineExpose({ setForm });
</script>

<style scoped lang="scss"></style>
