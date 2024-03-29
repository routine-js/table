# @routine-js/table

> Helps you request data to update the table

```typescript

import { AbsTableService, TablePresenter, TableServiceToken } from './index';

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
      current: 1,
      pageSize: 1,
      total: 1,
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(res);
      }, 1000);
    });
  }
}


const Page = () => {
  const { presenter, state } = usePresenter<TablePresenter<Row, Params>>(
    TablePresenter,
    {
      registry: [{ token: TableServiceToken, useClass: MyService }],
    },
  );
  return (
    <div>
      <h1>table state</h1>
      <p>{JSON.stringify(state, null, 4)}</p>

      <button
        onClick={() => {
          presenter.getTable();
        }}
      >
        fetch table
      </button>
    </div>
  );
};
```
