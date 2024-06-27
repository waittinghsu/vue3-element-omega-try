import request from "@/utils/request";
// 菜单基础URL
const DEMO_BASE_URL = "/api/v1/demo";

class DemoAPI {
  /**
   * 获取路由列表
   *
   * @returns 路由列表
   */
  static getCost(p: { id: number }) {
    console.log("omega", 1);
    return request<any, CostVO[]>({
      url: `${DEMO_BASE_URL}/apple/store/cost`,
      method: "get",
    });
  }
}

export default DemoAPI;

/** CostVO，路由对象 */
export interface CostVO {
  /** 子路由列表 */
  children?: CostVO[];
  /** 遊戲名称 */
  name: string;
  /** $$ */
  price: string;
  /** 日期 */
  date: string;
}
