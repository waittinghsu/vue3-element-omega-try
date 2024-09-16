<template>
  <!-- 分配权限弹窗 -->
  <el-drawer
    v-model="assignPermDialogVisible"
    :title="'【' + checkedRole.name + '】权限分配'"
    size="500"
  >
    <div class="flex-x-between">
      <el-input
        v-model="permKeywords"
        clearable
        class="w-[200px]"
        placeholder="菜单权限名称"
      >
        <template #prefix>
          <i-ep-search />
        </template>
      </el-input>

      <div class="flex-center">
        <el-button type="primary" size="small" plain @click="togglePermTree">
          <i-ep-switch />
          {{ isExpanded ? "收缩" : "展开" }}
        </el-button>
        <el-checkbox
          v-model="parentChildLinked"
          @change="handleParentChildLinkedChange"
          class="ml-5"
        >
          父子联动
        </el-checkbox>

        <el-tooltip placement="bottom">
          <template #content>
            如果只需勾选菜单权限，不需要勾选子菜单或者按钮权限，请关闭父子联动
          </template>
          <i-ep-QuestionFilled
            class="ml-1 color-[--el-color-primary] inline-block cursor-pointer"
          />
        </el-tooltip>
      </div>
    </div>

    <el-tree
      ref="permTreeRef"
      node-key="value"
      show-checkbox
      :data="menuPermOptions"
      :filter-node-method="handlePermFilter"
      :default-expand-all="true"
      :check-strictly="!parentChildLinked"
      class="mt-5"
    >
      <template #default="{ data }">
        {{ data.label }}
      </template>
    </el-tree>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleAssignPermSubmit">
          确 定
        </el-button>
        <el-button @click="assignPermDialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import RoleAPI from "@/api/role";

defineOptions({
  name: "RoleDrawer",
  inheritAttrs: false,
});

const emit = defineEmits<{
  (event: "update:visible"): void;
}>();

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  menuPermOptions: {
    type: Array as PropType<OptionType[]>,
    required: true,
    default: () => [],
  },
});

const assignPermDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});

const permTreeRef = ref<InstanceType<typeof ElTree>>();
const loading = ref(false);
const permKeywords = ref("");
const parentChildLinked = ref(true);
const isExpanded = ref(true);
interface CheckedRole {
  id?: number;
  name?: string;
}
// const menuPermOptions = ref<OptionType[]>([]);
const checkedRole = ref<CheckedRole>({});
// const assignPermDialogVisible = ref(false);

/** 分配菜单权限提交 */
function handleAssignPermSubmit() {
  const roleId = checkedRole.value.id;
  if (roleId) {
    const checkedMenuIds: number[] = permTreeRef
      .value!.getCheckedNodes(false, true)
      .map((node: any) => node.value);

    loading.value = true;
    RoleAPI.updateRoleMenus(roleId, checkedMenuIds)
      .then(() => {
        ElMessage.success("分配权限成功");
        assignPermDialogVisible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

/** 展开/收缩 菜单权限树  */
function togglePermTree() {
  isExpanded.value = !isExpanded.value;
  if (permTreeRef.value) {
    Object.values(permTreeRef.value.store.nodesMap).forEach((node: any) => {
      if (isExpanded.value) {
        node.expand();
      } else {
        node.collapse();
      }
    });
  }
}

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any;
  }
) {
  if (!value) return true;
  return data.label.includes(value);
}

/** 权限筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});
/** 父子菜单节点是否联动 change*/
function handleParentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}
</script>

<style scoped lang="scss"></style>
