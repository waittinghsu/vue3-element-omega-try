const cmdbRoutes: RouteBase[] = [
  {
    path: "/system",
    component: "Layout",
    redirect: "/system/user",
    name: "system",
    meta: {
      title: "系统管理",
      icon: "system",
      hidden: false,
      alwaysShow: false,
      params: null,
    },
    children: [
      {
        path: "demo",
        component: "system/demo/default-page/index",
        name: "DemoPage",
        meta: {
          title: "測試頁面",
          icon: "el-icon-User",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
        children: [],
      },
      {
        path: "menu",
        component: "system/menu/index",
        name: "Menu",
        meta: {
          title: "菜单管理",
          icon: "menu",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
        children: [],
      },
    ],
  },
  {
    path: "/multi-level",
    component: "Layout",
    name: "/multiLevel",
    meta: {
      title: "多级菜单",
      icon: "cascader",
      hidden: false,
      alwaysShow: true,
      params: null,
    },
    children: [
      {
        path: "multi-level1",
        component: "demo/multi-level/level1",
        name: "MultiLevel1",
        meta: {
          title: "菜单一级",
          icon: "",
          hidden: false,
          alwaysShow: true,
          params: null,
        },
        children: [
          {
            path: "multi-level2",
            component: "demo/multi-level/children/level2",
            name: "MultiLevel2",
            meta: {
              title: "菜单二级",
              icon: "",
              hidden: false,
              alwaysShow: false,
              params: null,
            },
            children: [
              {
                path: "multi-level3-1",
                component: "demo/multi-level/children/children/level3-1",
                name: "MultiLevel31",
                meta: {
                  title: "菜单三级-1",
                  icon: "",
                  hidden: false,
                  keepAlive: true,
                  alwaysShow: false,
                  params: null,
                },
                children: [],
              },
              {
                path: "multi-level3-2",
                component: "demo/multi-level/children/children/level3-2",
                name: "MultiLevel32",
                meta: {
                  title: "菜单三级-2",
                  icon: "",
                  hidden: false,
                  keepAlive: true,
                  alwaysShow: false,
                  params: null,
                },
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
export default cmdbRoutes;
