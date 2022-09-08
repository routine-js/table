/* eslint-disable import/no-extraneous-dependencies */
import { renderHook, act } from '@testing-library/react-hooks';
import { usePresenter } from '@clean-js/react-presenter';
import { TablePresenter, AbsTableService, TableServiceToken } from './index';

interface Row {
  name: string;
}
interface Params {
  name: string;
}
class MyService extends AbsTableService<Row, Params> {
  fetchTable(
    params: Partial<Params> & { current: number; pageSize: number },
  ): Promise<{
    data: Row[];
    current: number;
    pageSize: number;
    total: number;
  }> {
    const res = {
      data: [{ name: 'aloha' }],
      current: params.current,
      pageSize: 10,
      total: 100,
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res);
      }, 1000);
    });
  }
}

class ErrorService extends AbsTableService<Row, Params> {
  fetchTable(
    params: Partial<Params> & { current: number; pageSize: number },
  ): Promise<{
    data: Row[];
    current: number;
    pageSize: number;
    total: number;
  }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error('some error'));
      }, 1000);
    });
  }
}
describe('table', () => {
  // 初始数据
  it('init', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});
  });

  it('showLoading', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    act(() => {
      presenter.showLoading();
    });
    expect(count).toBe(2);
    expect(presenter.state.loading).toBe(true);
  });

  it('hideLoading', () => {
    let count = 0;
    const { result } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    act(() => {
      presenter.showLoading();
    });
    expect(count).toBe(2);
    expect(presenter.state.loading).toBe(true);

    act(() => {
      presenter.hideLoading();
    });
    expect(count).toBe(3);
    expect(presenter.state.loading).toBe(false);
  });

  it('getTable', async () => {
    let count = 0;
    const { result, waitFor, waitForValueToChange } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    presenter.getTable();
    await waitFor(() => presenter.state.loading === true);
    expect(count).toBe(2);
    expect(presenter.state.loading).toBe(true);

    await waitFor(() => presenter.state.pagination.total === 100);
    expect(count).toBe(4);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data[0].name).toBeDefined();
  });

  it('getTable, error service', async () => {
    let count = 0;
    const { result, waitFor, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: ErrorService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    presenter.getTable().catch((e) => {
      expect(e.message).toBe('some error');
    });

    await waitFor(() => presenter.state.loading === true);
    expect(count).toBe(2);
    expect(presenter.state.loading).toBe(true);

    await waitForNextUpdate();
  });
  it('updateTablePagination', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    act(() => {
      presenter.updateTablePagination({ pageSize: 20 });
    });
    expect(presenter.state.pagination.pageSize).toBe(20);

    act(() => {
      presenter.updateTablePagination({ current: 20 });
    });
    expect(presenter.state.pagination.current).toBe(20);

    act(() => {
      presenter.updateTablePagination({ total: 20 });
    });
    expect(presenter.state.pagination.total).toBe(20);

    act(() => {
      presenter.updateTablePagination({ total: 30, pageSize: 30, current: 30 });
    });
    expect(presenter.state.pagination.total).toBe(30);
    expect(presenter.state.pagination.pageSize).toBe(30);
    expect(presenter.state.pagination.current).toBe(30);

    // 请求固定返回pageSize为10
    act(() => {
      presenter.updateTablePagination({ pageSize: 20 });
      presenter.getTable();
    });
    await waitForNextUpdate();
    expect(presenter.state.pagination.pageSize).toBe(10);
  });

  it('updateTableParams', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    act(() => {
      presenter.updateTableParams({ name: 'a' });
    });
    expect(presenter.state.params.name).toBe('a');
  });

  it('resetTableParams', async () => {
    let count = 0;
    const { result, waitForNextUpdate } = renderHook(() => {
      count += 1;
      return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
        registry: [{ token: TableServiceToken, useClass: MyService }],
      });
    });
    const { presenter } = result.current;

    expect(count).toBe(1);
    expect(presenter.state.loading).toBe(false);
    expect(presenter.state.data).toEqual([]);
    expect(presenter.state.pagination.current).toBe(1);
    expect(presenter.state.pagination.pageSize).toBe(10);
    expect(presenter.state.pagination.total).toBe(0);
    expect(presenter.state.params).toEqual({});

    act(() => {
      presenter.updateTableParams({ name: 'a' });
    });
    expect(presenter.state.params.name).toBe('a');

    act(() => {
      presenter.resetTableParams();
    });
    expect(presenter.state.params).toEqual({});
  });
});
