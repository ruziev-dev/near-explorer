import * as React from "react";

import JSBI from "jsbi";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Block } from "@explorer/common/types/procedures";
import AccountLink from "@explorer/frontend/components/utils/AccountLink";
import BlockLink from "@explorer/frontend/components/utils/BlockLink";
import CardCell, {
  CardCellText,
  CardCellWrapper,
} from "@explorer/frontend/components/utils/CardCell";
import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import Gas from "@explorer/frontend/components/utils/Gas";
import GasPrice from "@explorer/frontend/components/utils/GasPrice";
import Term from "@explorer/frontend/components/utils/Term";
import { useDateFormat } from "@explorer/frontend/hooks/use-date-format";
import { useSubscription } from "@explorer/frontend/hooks/use-subscription";
import { styled } from "@explorer/frontend/libraries/styles";

const BlockInfoContainer = styled(Col, {
  border: "solid 4px #e6e6e6",
  borderRadius: 4,

  "& > .row": {
    borderBottom: "2px solid #e6e6e6",
  },

  "& > .row:last-of-type": {
    borderBottom: 0,
  },

  "@media (max-width: 768px)": {
    [`& ${CardCellWrapper}`]: {
      borderLeft: 0,
    },
  },
});

const BlockInfoHeader = styled(Row, {
  [`& ${CardCellText}`]: {
    fontSize: 24,
  },
});

const ParentHashCell = styled(CardCell, {
  backgroundColor: "#f8f8f8",
});

export interface Props {
  block: Block;
}

const BlockDetails: React.FC<Props> = React.memo(({ block }) => {
  const { t } = useTranslation();
  const latestBlockSub = useSubscription(["latestBlock"]);
  const gasUsed = React.useMemo(
    () => JSBI.BigInt(block.gasUsed),
    [block.gasUsed]
  );
  const format = useDateFormat();

  return (
    <Row noGutters>
      <BlockInfoContainer>
        <BlockInfoHeader noGutters>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.transactions.title")}
                  text={t("component.blocks.BlockDetails.transactions.text")}
                  href="https://docs.near.org/docs/concepts/transaction"
                />
              }
              imgLink="/static/images/icon-m-transaction.svg"
              text={block.transactionsCount.toLocaleString()}
              className="border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title={t("component.blocks.BlockDetails.receipts.title")}
              text={block.receiptsCount.toString()}
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.status.title")}
                  text={t("component.blocks.BlockDetails.status.text")}
                  href="https://docs.near.org/docs/develop/front-end/rpc#block"
                />
              }
              imgLink="/static/images/icon-t-status.svg"
              text={
                latestBlockSub.status !== "success"
                  ? t("common.blocks.status.checking_finality")
                  : block.timestamp < latestBlockSub.data.timestamp
                  ? t("common.blocks.status.finalized")
                  : t("common.blocks.status.finalizing")
              }
            />
          </Col>
        </BlockInfoHeader>
        <Row noGutters>
          <Col md="4">
            <CardCell
              title={t("component.blocks.BlockDetails.author.title")}
              text={<AccountLink accountId={block.authorAccountId} />}
              className="border-0"
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.gas_used.title")}
                  text={t("component.blocks.BlockDetails.gas_used.text")}
                  href="https://docs.near.org/docs/concepts/gas"
                />
              }
              imgLink="/static/images/icon-m-size.svg"
              text={<Gas gas={gasUsed} />}
            />
          </Col>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.gas_price.title")}
                  text={t("component.blocks.BlockDetails.gas_price.text")}
                  href="https://docs.near.org/docs/concepts/gas"
                />
              }
              imgLink="/static/images/icon-m-filter.svg"
              text={<GasPrice gasPrice={block.gasPrice} />}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="4">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.created.title")}
                  text={t("component.blocks.BlockDetails.created.text")}
                />
              }
              text={
                <>
                  {format(
                    block.timestamp,
                    t("common.date_time.date_time_format")
                  )}
                  <CopyToClipboard
                    text={String(block.timestamp)}
                    css={{ marginLeft: 8 }}
                  />
                </>
              }
              className="border-0"
            />
          </Col>
          <Col md="8">
            <CardCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.hash.title")}
                  text={t("component.blocks.BlockDetails.hash.text")}
                />
              }
              text={block.hash}
            />
          </Col>
        </Row>
        <Row noGutters>
          <Col md="12">
            <ParentHashCell
              title={
                <Term
                  title={t("component.blocks.BlockDetails.parent_hash.title")}
                  text={t("component.blocks.BlockDetails.parent_hash.text")}
                />
              }
              text={
                block.prevHash === "11111111111111111111111111111111" ? (
                  "Genesis"
                ) : (
                  <BlockLink blockHash={block.prevHash}>
                    {block.prevHash}
                  </BlockLink>
                )
              }
              className="border-0"
            />
          </Col>
        </Row>
      </BlockInfoContainer>
    </Row>
  );
});

export default BlockDetails;
