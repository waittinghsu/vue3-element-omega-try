declare global {
  /**
   * 响应数据
   */
  interface ResponseData<T = any> {
    code: string;
    data: T;
    msg: string;
  }

  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number;
    pageSize: number;
    ordering?: string;
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /** 数据列表 */
    list: T;
    /** 总数 */
    total: number;
  }

  /**
   * 页签对象
   */
  interface TagView {
    /** 页签名称 */
    name: string;
    /** 页签标题 */
    title: string;
    /** 页签路由路径 */
    path: string;
    /** 页签路由完整路径 */
    fullPath: string;
    /** 页签图标 */
    icon?: string;
    /** 是否固定页签 */
    affix?: boolean;
    /** 是否开启缓存 */
    keepAlive?: boolean;
    /** 路由查询参数 */
    query?: any;
  }

  /**
   * 系统设置
   */
  interface AppSettings {
    /** 系统标题 */
    title: string;
    /** 系统版本 */
    version: string;
    /** 是否显示设置 */
    showSettings: boolean;
    /** 是否固定头部 */
    fixedHeader: boolean;
    /** 是否显示多标签导航 */
    tagsView: boolean;
    /** 是否显示侧边栏Logo */
    sidebarLogo: boolean;
    /** 导航栏布局(left|top|mix) */
    layout: string;
    /** 主题颜色 */
    themeColor: string;
    /** 主题模式(dark|light) */
    theme: string;
    /** 布局大小(default |large |small) */
    size: string;
    /** 语言( zh-cn| en) */
    language: string;
    /** 是否开启水印 */
    watermarkEnabled: boolean;
    /** 水印内容 */
    watermarkContent: string;
  }

  /**
   * 组件数据源
   */
  interface OptionType {
    /** 值 */
    value: string | number;
    /** 文本 */
    label: string;
    /** 子列表  */
    children?: OptionType[];
  }

  /** RouteVO，路由对象 */
  interface RouteBase {
    /** 子路由列表 */
    children: RouteBase[];
    /** 组件路径 */
    component?: string;
    /** 路由属性 */
    meta?: MetaBase;
    /** 路由名称 */
    name?: string;
    /** 路由路径 */
    path?: string;
    /** 跳转链接 */
    redirect?: string;
  }

  /** Meta，路由属性 */
  interface MetaBase {
    /** 【目录】只有一个子路由是否始终显示 */
    alwaysShow?: boolean;
    /** 是否隐藏(true-是 false-否) */
    hidden?: boolean;
    /** ICON */
    icon?: string;
    /** 【菜单】是否开启页面缓存 */
    keepAlive?: boolean;
    /** 路由title */
    title?: string;
    /** 看起來是可以帶參數的 */
    params?: Record<string, any> | null;
  }
}
export {};
