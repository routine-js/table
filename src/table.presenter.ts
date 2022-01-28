import { inject, Presenter, injectable } from '@lujs/mvp';
import { IPagination, TableModel } from './table.model';

export abstract class AbsTableService<Row = any, Params = Record<any, any>> {
  abstract fetchTable(
    params: Partial<Params> & { current: number; pageSize: number },
  ): Promise<{ data: Row[]; current: number; pageSize: number; total: number }>;
}

export const TableServiceToken = 'TableServiceToken';

@injectable()
export class TablePresenter<
  Row = any,
  Params = Record<any, any>,
> extends Presenter<TableModel<Row, Partial<Params>>> {
  constructor(
    protected model: TableModel<Row, Partial<Params>>,
    @inject(TableServiceToken) private service: AbsTableService<Row, Params>,
  ) {
    super();
  }

  showLoading() {
    this.model.setState((s) => {
      s.loading = true;
    });
  }

  hideLoading() {
    this.model.setState((s) => {
      s.loading = false;
    });
  }

  getTable() {
    const params: Partial<Params> = {};
    Object.entries(this.model.state.table?.params || {}).map(([k, v]) => {
      if (v !== undefined) {
        Object.assign(params, { [k]: v });
      }
    });
    this.showLoading();
    this.service
      .fetchTable({
        current: this.state.table.pagination.current,
        pageSize: this.state.table.pagination.pageSize,
        ...params,
      })
      .then((res) => {
        this.setState((s) => {
          s.table.pagination.current = res.current;
          s.table.pagination.pageSize = res.pageSize;
          s.table.pagination.total = res.total;
          s.table.data = res.data;
        });
      })
      .finally(() => {
        this.hideLoading();
      });
  }

  updateTablePagination(pagination: Partial<IPagination>) {
    this.setState((s) => {
      s.table.pagination = {
        ...s.table.pagination,
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
      s.table.params = {
        ...s.table.params,
        ...d,
      };
    });
  }

  resetTableParams() {
    this.setState((s) => {
      s.table.params = {};
    });
  }
}
