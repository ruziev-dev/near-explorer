import * as React from "react";

import JSBI from "jsbi";
import { Trans, useTranslation } from "react-i18next";

import { Account } from "@explorer/common/types/procedures";
import ShortenValue from "@explorer/frontend/components/beta/common/ShortenValue";
import StringConditionalOverlay from "@explorer/frontend/components/beta/common/StringConditionalOverlay";
import Timestamp from "@explorer/frontend/components/beta/common/Timestamp";
import TransactionLink from "@explorer/frontend/components/beta/common/TransactionLink";
import CopyToClipboard from "@explorer/frontend/components/utils/CopyToClipboard";
import { NearAmount } from "@explorer/frontend/components/utils/NearAmount";
import Timer from "@explorer/frontend/components/utils/Timer";
import * as BI from "@explorer/frontend/libraries/bigint";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatBytes,
  formatToPowerOfTen,
  shortenString,
} from "@explorer/frontend/libraries/formatting";
import { styled } from "@explorer/frontend/libraries/styles";
import { trpc } from "@explorer/frontend/libraries/trpc";

type Props = {
  account: Account;
};

const Wrapper = styled("div", {
  padding: 28,
  borderRadius: 8,
  backgroundColor: "#000",
  color: "#fff",
});

const HorizontalBlock = styled("div", {
  display: "flex",
  justifyContent: "space-between",

  "& + &": {
    marginTop: 32,
  },

  "@media (max-width: 1000px)": {
    flexDirection: "column",
  },
});

const BaseInfo = styled("div", {
  display: "flex",
  marginRight: 48,

  "@media (max-width: 1000px)": {
    marginRight: 0,
    marginBottom: 48,
  },
});

const ContractInfo = styled("div", {
  display: "flex",
  flexWrap: "wrap",

  "> *": {
    marginRight: 24,
  },
  "> *:last-child": {
    marginRight: 0,
  },
});

const AccountId = styled("h1", {
  fontSize: 36,
  fontWeight: 700,
  fontFamily: "Manrope",
  color: "#ffffff",
});

const AccountCopy = styled("span", {
  marginLeft: 16,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 8,
});

const InfoLineGap = styled("div", {
  marginLeft: 32,
});

const InfoLine = styled("span", {
  color: "#c9c9c9",
  fontSize: 12,
});

const CreatedBy = styled(InfoLine, {
  textDecoration: "underline",
});

const NumericDivider = styled("div", {
  marginHorizontal: 16,
});

const AccountTypeBadge = styled("div", {
  textTransform: "uppercase",
  fontSize: 10,
  fontWeight: 700,
  fontFamily: "Manrope",
  borderRadius: 4,
  padding: "4px 12px",

  variants: {
    type: {
      user: {
        backgroundColor: "#7578FB",
        color: "#ffffff",
      },
      contract: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
      },
    },
  },
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});

const SmallHeader = styled("div", {
  fontSize: 12,
  color: "#c9c9c9",
});

const Quantity = styled("div", {
  fontWeight: 500,
  fontSize: 24,
  color: "#ffffff",
  marginTop: 16,
  whiteSpace: "nowrap",
});

const AccountHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  const transactionsQuantity =
    props.account.transactionsQuantity === undefined
      ? undefined
      : formatToPowerOfTen<BasicDecimalPower>(
          props.account.transactionsQuantity.toString(),
          6
        );
  const contractQuery = trpc.useQuery([
    "contract.byId",
    { id: props.account.id },
  ]);
  return (
    <Wrapper>
      <HorizontalBlock>
        <BaseInfo>
          <div>
            <StringConditionalOverlay
              tooltipId="accountId"
              value={props.account.id}
            >
              <AccountId>
                {shortenString(props.account.id)}
                <AccountCopy>
                  <CopyToClipboard text={props.account.id} />
                </AccountCopy>
              </AccountId>
            </StringConditionalOverlay>
            <BaseInfoDetails>
              <CreatedBy
                as={props.account.created ? "a" : undefined}
                href={
                  props.account.created
                    ? `/transactions/${props.account.created.hash}`
                    : undefined
                }
              >
                {props.account.created ? (
                  <Trans
                    i18nKey="pages.account.header.createdAt"
                    t={t}
                    components={{
                      Timer: <Timer time={props.account.created.timestamp} />,
                    }}
                  />
                ) : (
                  t("common.terms.genesis")
                )}
              </CreatedBy>
              <InfoLineGap />
              <InfoLine>
                {t("pages.account.header.storageUsed", {
                  amount: formatBytes(props.account.storageUsed),
                })}
              </InfoLine>
              <InfoLineGap />
              <AccountTypeBadge
                type={props.account.isContract ? "contract" : "user"}
              >
                {props.account.isContract
                  ? t("pages.account.header.accountType.contract")
                  : t("pages.account.header.accountType.user")}
              </AccountTypeBadge>
            </BaseInfoDetails>
          </div>
        </BaseInfo>
        <NumericInfo>
          <div>
            <SmallHeader>
              {t("pages.account.header.amounts.balance")}
            </SmallHeader>
            <Quantity>
              <NearAmount
                amount={props.account.nonStakedBalance}
                decimalPlaces={2}
              />
            </Quantity>
          </div>
          <NumericDivider />
          {!JSBI.equal(JSBI.BigInt(props.account.stakedBalance), BI.zero) ? (
            <>
              <div>
                <SmallHeader>
                  {t("pages.account.header.amounts.staked")}
                </SmallHeader>
                <Quantity>
                  <NearAmount
                    amount={props.account.stakedBalance}
                    decimalPlaces={2}
                  />
                </Quantity>
              </div>
              <NumericDivider />
            </>
          ) : null}
          <div>
            <SmallHeader>
              {t("pages.account.header.amounts.transactions")}
            </SmallHeader>
            {transactionsQuantity ? (
              <Quantity>{`${transactionsQuantity.quotient}${
                BASIC_DENOMINATION[transactionsQuantity.prefix]
              }`}</Quantity>
            ) : null}
          </div>
        </NumericInfo>
      </HorizontalBlock>
      {contractQuery.data ? (
        <HorizontalBlock>
          <ContractInfo>
            <div>
              <SmallHeader>
                {t("pages.account.header.contract.lockedStatus")}
              </SmallHeader>
              <span>
                {contractQuery.data.locked
                  ? t("pages.account.header.contract.status.locked")
                  : t("pages.account.header.contract.status.unlocked")}
              </span>
            </div>
            <div>
              <SmallHeader>
                {t("pages.account.header.contract.codeHash")}
              </SmallHeader>
              <ShortenValue>{contractQuery.data.codeHash}</ShortenValue>
            </div>
            {contractQuery.data.timestamp ? (
              <div>
                <SmallHeader>
                  {t("pages.account.header.contract.updatedTimestamp")}
                </SmallHeader>
                <Timestamp timestamp={contractQuery.data.timestamp} />
              </div>
            ) : null}
            {contractQuery.data.transactionHash ? (
              <div>
                <SmallHeader>
                  {t("pages.account.header.contract.updatedTransaction")}
                </SmallHeader>
                <TransactionLink hash={contractQuery.data.transactionHash} />
              </div>
            ) : null}
          </ContractInfo>
        </HorizontalBlock>
      ) : null}
    </Wrapper>
  );
});

export default AccountHeader;
