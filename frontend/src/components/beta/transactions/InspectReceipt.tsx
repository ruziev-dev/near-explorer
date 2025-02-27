import * as React from "react";

import JSBI from "jsbi";

import { Action, TransactionReceipt } from "@explorer/common/types/procedures";
import * as RPC from "@explorer/common/types/rpc";
import AccountLink from "@explorer/frontend/components/beta/common/AccountLink";
import BlockLink from "@explorer/frontend/components/beta/common/BlockLink";
import Gas from "@explorer/frontend/components/utils/Gas";
import { NearAmount } from "@explorer/frontend/components/utils/NearAmount";
import * as BI from "@explorer/frontend/libraries/bigint";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

type Props = {
  receipt: TransactionReceipt;
};

const Table = styled("table", {
  width: "100%",
  marginVertical: 24,
});

const TableElement = styled("td", {
  color: "#000000",
  fontSize: 14,
  lineHeight: "175%",
});

const BalanceTitle = styled("div", {
  marginTop: 36,
  fontWeight: 600,
});

const BalanceAmount = styled("div", {
  color: "#1A8300",
});

const getDeposit = (actions: Action[]): JSBI =>
  actions
    .map((action) =>
      "deposit" in action.args ? JSBI.BigInt(action.args.deposit) : BI.zero
    )
    .reduce((accumulator, deposit) => JSBI.add(accumulator, deposit), BI.zero);
const getGasAttached = (actions: Action[]): JSBI => {
  const gasAttached = actions
    .map((action) => action.args)
    .filter(
      (args): args is RPC.FunctionCallActionView["FunctionCall"] =>
        "gas" in args
    );
  if (gasAttached.length === 0) {
    return BI.zero;
  }
  return gasAttached.reduce(
    (accumulator, args) =>
      JSBI.add(accumulator, JSBI.BigInt(args.gas.toString())),
    BI.zero
  );
};

const InspectReceipt: React.FC<Props> = React.memo(
  ({ receipt: { id, ...receipt } }) => {
    const { data: predecessorBalance } = trpc.useQuery([
      "transaction.accountBalanceChange",
      { accountId: receipt.predecessorId, receiptId: id },
    ]);
    const { data: receiverBalance } = trpc.useQuery([
      "transaction.accountBalanceChange",
      { accountId: receipt.receiverId, receiptId: id },
    ]);

    const gasAttached = getGasAttached(receipt.actions);
    const refund =
      receipt.outcome.nestedReceipts
        .filter(
          (nestedReceipt): nestedReceipt is TransactionReceipt =>
            "outcome" in nestedReceipt &&
            nestedReceipt.predecessorId === "system"
        )
        .reduce(
          (acc, nestedReceipt) =>
            JSBI.add(acc, getDeposit(nestedReceipt.actions)),
          BI.zero
        )
        .toString() ?? "0";

    return (
      <Table>
        <tr>
          <TableElement>Receipt ID</TableElement>
          <TableElement>{id}</TableElement>
        </tr>
        <tr>
          <TableElement>Executed in Block</TableElement>
          <TableElement>
            <BlockLink
              blockHash={receipt.outcome.block.hash}
              blockHeight={receipt.outcome.block.height}
            />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Predecessor ID</TableElement>
          <TableElement>
            <AccountLink accountId={receipt.predecessorId} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Receiver ID</TableElement>
          <TableElement>
            <AccountLink accountId={receipt.receiverId} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Attached Gas</TableElement>
          <TableElement>
            <Gas gas={gasAttached} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Gas Burned</TableElement>
          <TableElement>
            <Gas gas={JSBI.BigInt(receipt.outcome.gasBurnt)} />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Tokens Burned</TableElement>
          <TableElement>
            <NearAmount
              amount={receipt.outcome.tokensBurnt}
              decimalPlaces={2}
            />
          </TableElement>
        </tr>
        <tr>
          <TableElement>Refunded</TableElement>
          <TableElement>
            <NearAmount amount={refund} decimalPlaces={2} />
          </TableElement>
        </tr>
        <tr>
          <TableElement colSpan={2}>
            <BalanceTitle>New Balance</BalanceTitle>
          </TableElement>
        </tr>
        <tr>
          <TableElement>
            <AccountLink accountId={receipt.predecessorId} />
          </TableElement>
          <TableElement>
            <BalanceAmount>
              {predecessorBalance ? (
                <NearAmount amount={predecessorBalance} decimalPlaces={2} />
              ) : (
                "-"
              )}
            </BalanceAmount>
          </TableElement>
        </tr>
        <tr>
          <TableElement>
            <AccountLink accountId={receipt.receiverId} />
          </TableElement>
          <TableElement>
            <BalanceAmount>
              {receiverBalance ? (
                <NearAmount amount={receiverBalance} decimalPlaces={2} />
              ) : (
                "-"
              )}
            </BalanceAmount>
          </TableElement>
        </tr>
      </Table>
    );
  }
);

export default InspectReceipt;
