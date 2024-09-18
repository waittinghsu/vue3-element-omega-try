<template>
  <div class="app-container">
    <SearchContainer
      v-model:list-query="queryParams"
      :choices="choices"
      @handle-search="handleSearch"
    />
    {{ queryParams }}
    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="handleOpenDialog()">
          <i-ep-plus />
          新增
        </el-button>
        <el-button
          type="danger"
          :disabled="ids.length === 0"
          @click="handleDelete()"
        >
          <i-ep-delete />
          删除
        </el-button>
      </template>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="roleList"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="角色名称"
          prop="name"
          min-width="100"
          sortable
        />
        <el-table-column label="角色编码" prop="code" width="150" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" width="80" prop="sort" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenAssignPermDialog(scope.row)"
            >
              <i-ep-position />
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              link
              @click="handleOpenDialog(scope.row.id)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click="handleDelete(scope.row.id)"
            >
              <i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="pageNum"
        v-model:limit="pageSize"
        @pagination="handlePageChange"
      />
      {{ pageNum }}- {{ pageSize }}
    </el-card>
    <role-edit-dialog
      ref="roleEditDialogRef"
      v-model:visible="dialog.visible"
      @handle-submit="handleSubmit"
    />
    <role-drawer
      ref="roleDrawerRef"
      v-model:visible="assignPermDialogVisible"
      :checked-role="checkedRole"
      :menuPermOptions="menuPermOptions"
    />
  </div>
</template>

<script setup lang="ts">
import SearchContainer from "./components/SearchContainer.vue";
import RoleEditDialog from "./components/RoleEditDialog.vue";
import RoleDrawer from "./components/RoleDrawer.vue";
defineOptions({
  name: "DemoPage",
  inheritAttrs: false,
});

import RoleAPI, { RolePageVO, RoleForm, RolePageQuery } from "@/api/role";
import MenuAPI from "@/api/menu";
import { Choices, QueryParams, SubmitParams } from "./types";
import { EmitPayload, QueryType } from "@/mixins/useSearchComposable";

const assignPermDialogVisible = ref(false);
type RoleEditDialogInstance = InstanceType<typeof RoleEditDialog>;
const roleEditDialogRef = ref<RoleEditDialogInstance>();
type RoleDrawerInstance = InstanceType<typeof RoleDrawer>;
const roleDrawerRef = ref<RoleDrawerInstance>();

const queryParams: QueryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  keywords: "",
  dept: undefined,
  group: undefined,
  status: undefined,
});

const { pageNum, pageSize } = toRefs(queryParams);

const choices = ref<Choices>({
  status: [
    { id: 1, name: "正常" },
    { id: 0, name: "禁用" },
  ],
  product: [
    { id: 562, name: "H800" },
    { id: 563, name: "T900" },
  ],
  user: [
    { id: 110, name: "omega" },
    { id: 111, name: "jerome" },
  ],
  group: [
    { id: 100, name: "SA" },
    { id: 101, name: "PH" },
  ],
  userDic: {},
});

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);
// 角色表格数据
const roleList = ref<RolePageVO[]>();
// 菜单权限下拉
const menuPermOptions = ref<OptionType[]>([]);
// 弹窗
const dialog = reactive({
  visible: false,
});
// 选中的角色
interface CheckedRole {
  id?: number;
  name?: string;
}
const checkedRole = ref<CheckedRole>({});
/** 查询 */
function handleSearch({ type }: EmitPayload<QueryParams>) {
  console.log("handleQuery-queryParams", type, queryParams);
  loading.value = true;
  RoleAPI.getPage(queryParams)
    .then((data) => {
      roleList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 行复选框选中记录选中ID集合 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

function handleSortChange(params: any) {
  handleSearch({ type: QueryType.Search });
  console.log("handleSortChange", params);
}

function handlePageChange(params: any) {
  console.log("handlePageChange", params);
}
/** 打开角色弹窗 */
function handleOpenDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    RoleAPI.getFormData(roleId).then((data) => {
      roleEditDialogRef.value?.show({ type: "EDIT", editForm: data });
    });
  } else {
    roleEditDialogRef.value?.show({ type: "ADD", editForm: {} });
  }
}

/** 提交角色表单 */
function handleSubmit({ type, data }: SubmitParams<RoleForm>) {
  switch (type) {
    case "ADD":
      RoleAPI.add(data)
        .then(() => {
          ElMessage.success("新增成功");
          roleEditDialogRef.value?.hide();
        })
        .finally(() => (loading.value = false));
      break;
    case "EDIT":
      RoleAPI.update(data.id as number, data as RoleForm)
        .then(() => {
          ElMessage.success("修改成功");
          roleEditDialogRef.value?.hide();
        })
        .finally(() => (loading.value = false));
      break;
  }
}

/** 删除角色 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      RoleAPI.deleteByIds(roleIds)
        .then(() => {
          ElMessage.success("删除成功");
        })
        .finally(() => (loading.value = false));
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}

/** 打开分配菜单权限弹窗 */
async function handleOpenAssignPermDialog(row: RolePageVO) {
  const roleId = row.id;
  console.log("roleId", roleId);
  if (roleId) {
    assignPermDialogVisible.value = true;
    loading.value = true;

    checkedRole.value.id = roleId;
    checkedRole.value.name = row.name;

    // 获取所有的菜单
    menuPermOptions.value = await MenuAPI.getOptions();

    // 回显角色已拥有的菜单
    RoleAPI.getRoleMenuIds(roleId)
      .then((data) => {
        roleDrawerRef.value?.setData(data);
        // const checkedMenuIds = data;
        // data.forEach((menuId) =>
        // permTreeRef.value!.setChecked(menuId, true, false)
        // );
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

onMounted(() => {
  handleSearch({ type: QueryType.Search });
});
</script>
