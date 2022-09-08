/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */

import { usePresenter } from '@clean-js/react-presenter';
// import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react-hooks';
import React from 'react';
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

// const Page = () => {
//   const { presenter } = usePresenter<TablePresenter<Row, Params>>(
//     TablePresenter,
//     {
//       registry: [{ token: TableServiceToken, useClass: MyService }],
//     },
//   );
//   return (
//     <div>
//       <h1>table state</h1>
//       <p>{JSON.stringify(presenter.state, null, 4)}</p>

//       <button
//         onClick={() => {
//           presenter.getTable();
//         }}
//       >
//         fetch table
//       </button>
//     </div>
//   );
// };

it('test react render', (done) => {
  let count = 0;
  const { result } = renderHook(() => {
    count += 1;
    return usePresenter<TablePresenter<Row, Params>>(TablePresenter, {
      registry: [{ token: TableServiceToken, useClass: MyService }],
    });
  });
  expect(count).toBe(1);
  act(() => {
    result.current.presenter.getTable();
  });
  expect(count).toBe(2);

  setTimeout(() => {
    expect(result.current.state.data.length).toBe(1);
    done();
  }, 1000);
});
