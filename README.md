# @routine-js/table

> Helps you request data to update the table

```typescript
  const { presenter: tablePresenter } = usePresenter<
    TablePresenter<IDownloadTableRow>
  >(TablePresenter, {
    registry: [
      {
        token: TableServiceToken,
        useClass: MyTableService,
      },
    ],
  });
```
