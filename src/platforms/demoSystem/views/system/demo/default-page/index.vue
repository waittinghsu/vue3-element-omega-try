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
      :title="dialog.title"
    />
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
            @change="handleparentChildLinkedChange"
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
  </div>
</template>

<script setup lang="ts">
import SearchContainer from "@/platforms/demoSystem/views/system/demo/default-page/components/SearchContainer.vue";
import RoleEditDialog from "@/platforms/demoSystem/views/system/demo/default-page/components/RoleEditDialog.vue";
defineOptions({
  name: "DemoPage",
  inheritAttrs: false,
});

import RoleAPI, { RolePageVO, RoleForm, RolePageQuery } from "@/api/role";
import MenuAPI from "@/api/menu";
import {
  Choices,
  type QueryParams,
} from "@/platforms/demoSystem/views/system/demo/default-page/types";
import { EmitPayload, QueryType } from "@/mixins/useSearchComposable";

type RoleEditDialogInstance = InstanceType<typeof RoleEditDialog>;
const roleEditDialogRef = ref<RoleEditDialogInstance>();

const queryParams: QueryParams = reactive({
  pageNum: 1,
  pageSize: 20,
  keywords: "",
  dept: undefined,
  group: undefined,
  status: undefined,
});

const { pageNum, pageSize } = toRefs(queryParams);

const permTreeRef = ref<InstanceType<typeof ElTree>>();
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
  title: "",
  visible: false,
});

// 选中的角色
interface CheckedRole {
  id?: number;
  name?: string;
}
const checkedRole = ref<CheckedRole>({});
const assignPermDialogVisible = ref(false);

const permKeywords = ref("");
const isExpanded = ref(true);

const parentChildLinked = ref(true);

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
    dialog.title = "修改角色";
    RoleAPI.getFormData(roleId).then((data) => {
      // Object.assign(formData, data);
      if (roleEditDialogRef.value?.setForm) {
        console.log(typeof roleEditDialogRef.value);
        roleEditDialogRef.value.setForm(data);
      }
    });
  } else {
    dialog.title = "新增角色";
  }
}

/** 提交角色表单 */
function handleSubmit() {
  // roleFormRef.value.validate((valid: any) => {
  //   if (valid) {
  //     loading.value = true;
  //     const roleId = formData.id;
  //     if (roleId) {
  //       RoleAPI.update(roleId, formData)
  //         .then(() => {
  //           ElMessage.success("修改成功");
  //           handleCloseDialog();
  //         })
  //         .finally(() => (loading.value = false));
  //     } else {
  //       RoleAPI.add(formData)
  //         .then(() => {
  //           ElMessage.success("新增成功");
  //           handleCloseDialog();
  //         })
  //         .finally(() => (loading.value = false));
  //     }
  //   }
  // });
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
        const checkedMenuIds = data;
        checkedMenuIds.forEach((menuId) =>
          permTreeRef.value!.setChecked(menuId, true, false)
        );
      })
      .finally(() => {
        loading.value = false;
      });
  }
}

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

/** 权限筛选 */
watch(permKeywords, (val) => {
  permTreeRef.value!.filter(val);
});

function handlePermFilter(
  value: string,
  data: {
    [key: string]: any;
  }
) {
  if (!value) return true;
  return data.label.includes(value);
}

/** 父子菜单节点是否联动 change*/
function handleparentChildLinkedChange(val: any) {
  parentChildLinked.value = val;
}

onMounted(() => {
  // handleQuery();
});
</script>
