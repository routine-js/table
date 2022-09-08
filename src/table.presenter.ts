import { inject, Presenter, injectable } from '@clean-js/presenter';

export abstract class AbsTableService<Row = any, Params = Record<any, any>> {
  abstract fetchTable(
    params: Partial<Params> & { current: number; pageSize: number },
  ): Promise<{ data: Row[]; current: number; pageSize: number; total: number }>;
}

export const TableServiceToken = Symbol('TableServiceToken');

// 三个固定参数
export interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}
interface IViewState<Row, OtherParams> {
  loading: boolean;
  // 请求表格的数据
  data: Row[];
  params: OtherParams; // 额外参数
  pagination: IPagination;
}

@injectable()
export class TablePresenter<
  Row = any,
  Params = Record<any, any>,
> extends Presenter<IViewState<Row, Params>> {
  constructor(
    @inject(TableServiceToken as unknown as string)
    private service: AbsTableService<Row, Params>,
  ) {
    super();
    this.state = {
      loading: false,
      params: {} as Record<any, any>,
      pagination: { current: 1, pageSize: 10, total: 0 },
      data: [],
    };
  }

  showLoading() {
    this.setState((s) => {
      s.loading = true;
    });
  }

  hideLoading() {
    this.setState((s) => {
      s.loading = false;
    });
  }

  getTable() {
    const params: Partial<Params> = {};
    Object.entries(this.state.params || {}).forEach(([k, v]) => {
      if (v !== undefined) {
        Object.assign(params, { [k]: v });
      }
    });
    this.showLoading();
    return this.service
      .fetchTable({
        current: this.state.pagination.current,
        pageSize: this.state.pagination.pageSize,
        ...params,
      })
      .then((res) => {
        this.setState((s) => {
          s.pagination.current = res.current;
          s.pagination.pageSize = res.pageSize;
          s.pagination.total = res.total;
          s.data = res.data;
        });
        return res;
      })
      .finally(() => {
        this.hideLoading();
      });
  }

  updateTablePagination(pagination: Partial<IPagination>) {
    this.setState((s) => {
      s.pagination = {
        ...s.pagination,
        ...pagination,
      };
    });
  }

  updateTableParams(params: Partial<Params>) {
    const d: Partial<Params> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) {
        Object.assign(d, {
          [k]: v,
        });
      }
    });

    this.setState((s) => {
      s.params = {
        ...s.params,
        ...d,
      };
    });
  }

  resetTableParams() {
    this.setState((s) => {
      s.params = {} as Record<any, any>;
    });
  }
}
