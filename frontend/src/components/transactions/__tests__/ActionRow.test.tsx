import * as React from "react";

import { Action } from "@explorer/common/types/procedures";
import ActionRow from "@explorer/frontend/components/transactions/ActionRow";
import TransactionExecutionStatus from "@explorer/frontend/components/transactions/TransactionExecutionStatus";
import ReceiptLink from "@explorer/frontend/components/utils/ReceiptLink";
import TransactionLink from "@explorer/frontend/components/utils/TransactionLink";
import { renderElement } from "@explorer/frontend/testing/utils";

import { RECEIPTS, TRANSACTIONS } from "./common";

describe("<ActionRow />", () => {
  it("renders sparsely ActionRow for transaction by default", () => {
    expect(
      renderElement(
        <ActionRow
          signerId={TRANSACTIONS[0].signerId}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          receiverId={TRANSACTIONS[0].receiverId}
          action={{
            kind: "createAccount",
            args: {},
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely ActionRow for transaction with status", () => {
    expect(
      renderElement(
        <ActionRow
          signerId={TRANSACTIONS[0].signerId}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          receiverId={TRANSACTIONS[0].receiverId}
          action={{
            kind: "createAccount",
            args: {},
          }}
          status={
            <TransactionExecutionStatus
              status={TRANSACTIONS[0].status ?? "SuccessValue"}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders sparsely ActionRow for receipt", () => {
    expect(
      renderElement(
        <ActionRow
          signerId={RECEIPTS[7].signerId}
          receiverId={RECEIPTS[7].receiverId}
          blockTimestamp={RECEIPTS[7].blockTimestamp}
          action={RECEIPTS[7].actions[0]}
          detailsLink={
            <ReceiptLink
              transactionHash={RECEIPTS[7].originatedFromTransactionHash}
              receiptId={RECEIPTS[7].id}
            />
          }
          status={
            <TransactionExecutionStatus
              status={TRANSACTIONS[0].status ?? "SuccessValue"}
            />
          }
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for transaction", () => {
    expect(
      renderElement(
        <ActionRow
          viewMode="compact"
          signerId={TRANSACTIONS[0].signerId}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          detailsLink={
            <TransactionLink transactionHash={TRANSACTIONS[0].hash} />
          }
          receiverId={TRANSACTIONS[0].receiverId}
          action={{
            kind: "addKey",
            args: {
              accessKey: {
                nonce: 0,
                permission: { type: "fullAccess" },
              },
              publicKey: "ed25519:8LXEySyBYewiTTLxjfF1TKDsxxxxxxxxxxxxxxxxxx",
            },
          }}
        />
      )
    ).toMatchSnapshot();
  });

  it("renders compact for receipt", () => {
    expect(
      renderElement(
        <ActionRow
          viewMode="compact"
          detalizationMode="minimal"
          signerId={RECEIPTS[1].signerId}
          receiverId={RECEIPTS[1].receiverId}
          action={RECEIPTS[1].actions[0]}
        />
      )
    ).toMatchSnapshot();
  });

  const actionFunctionCall: Action = {
    kind: "functionCall",
    args: {
      args: "eyJ2YWx1ZSI6MX0=",
      deposit: "1",
      gas: 2000000000000,
      methodName: "incrementCounter",
    },
  };

  it("renders functioncall with detail", () => {
    expect(
      renderElement(
        <ActionRow
          signerId={TRANSACTIONS[0].signerId}
          receiverId={TRANSACTIONS[0].receiverId}
          blockTimestamp={TRANSACTIONS[0].blockTimestamp}
          action={actionFunctionCall}
          showDetails
        />
      )
    ).toMatchSnapshot();
  });
});
