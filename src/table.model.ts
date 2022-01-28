import { Model } from '@lujs/mvp';

// 三个固定参数
export interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}
interface IViewState<Row, OtherParams> {
  loading: boolean;
  // 请求表格的数据
  table: {
    data: Row[];
    params: OtherParams; // 额外参数
    pagination: IPagination;
  };
}
export class TableModel<Row, P> extends Model<IViewState<Row, P>> {
  constructor() {
    super();
    this.state = {
      loading: false,
      table: {
        params: {} as Record<any, any>,
        pagination: { current: 1, pageSize: 10, total: 0 },
        data: [],
      },
    };
  }
}
