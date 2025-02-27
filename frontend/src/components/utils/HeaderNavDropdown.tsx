import * as React from "react";

import { StyledComponent } from "@stitches/react/types/styled-component";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Link from "@explorer/frontend/components/utils/Link";
import { globalCss, styled } from "@explorer/frontend/libraries/styles";
import IconAccounts from "@explorer/frontend/public/static/images/icon-accounts.svg";
import IconBlocks from "@explorer/frontend/public/static/images/icon-blocks.svg";
import IconNodes from "@explorer/frontend/public/static/images/icon-nodes.svg";
import IconStats from "@explorer/frontend/public/static/images/icon-stats.svg";
import IconTransactions from "@explorer/frontend/public/static/images/icon-transactions.svg";

const Icon = styled("svg", {
  width: 16,
  marginRight: 3,
});

const HeaderNavLink = styled("a", {
  display: "block",
  color: "#a5a5a5",
  paddingTop: 10,
  paddingBottom: 15,
  paddingLeft: 18,
  textDecoration: "none",
  width: "100%",
  height: "100%",
  cursor: "pointer",

  "&:hover": {
    background: "#000000",
    color: "white",
  },

  [`&:hover ${Icon}`]: {
    stroke: "#00c1de",
  },
});

const NavText = styled("span", {
  letterSpacing: 2,
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  marginLeft: 10,
});

interface Props {
  link: string;
  IconElement: StyledComponent;
  text: React.ReactNode;
}

const HeaderNavItem: React.FC<Props> = React.memo(
  ({ link, IconElement, text }) => (
    <Link href={link} passHref>
      <HeaderNavLink>
        <Icon as={IconElement} />
        <NavText>{text}</NavText>
      </HeaderNavLink>
    </Link>
  )
);

const ChainHeader = styled(Dropdown.Toggle, {
  color: "#000000",
  background: "#ffffff",
  border: "none",
  fontWeight: 500,
  width: "100%",

  "&:hover, &:focus, &:active, .show > &.dropdown-toggle": {
    background: "#ffffff !important",
    color: "#000000 !important",
    border: "none",
  },

  "&:focus": {
    boxShadow: "none",
  },
});

const HeaderDropdownMenu = styled(Dropdown.Menu, {
  background: "#25272a",
  borderRadius: 8,
  width: 267,
});

const DropdownArrow = styled("img", {
  marginLeft: 9,
});

const globalStyles = globalCss({
  ".dropdown-toggle::after": {
    content: "none",
  },

  [`.show > .dropdown-toggle > ${DropdownArrow}`]: {
    transform: "rotate(180deg)",
  },

  ".show > .btn-primary.dropdown-toggle:focus": {
    boxShadow: "none",
  },
});

const HeaderNavDropdown: React.FC = React.memo(() => {
  const { t } = useTranslation();
  globalStyles();
  return (
    <Dropdown>
      <ChainHeader>
        {t("component.utils.HeaderNavDropdown.title")}
        <DropdownArrow src="/static/images/down-arrow.svg" />
      </ChainHeader>
      <HeaderDropdownMenu>
        <HeaderNavItem
          link="/accounts"
          IconElement={IconAccounts}
          text={t("common.accounts.accounts")}
        />
        <HeaderNavItem
          link="/blocks"
          IconElement={IconBlocks}
          text={t("common.blocks.blocks")}
        />
        <HeaderNavItem
          link="/transactions"
          IconElement={IconTransactions}
          text={t("common.transactions.transactions")}
        />
        <HeaderNavItem
          link="/nodes/validators"
          IconElement={IconNodes}
          text={t("common.nodes.title")}
        />
        <HeaderNavItem
          link="/stats"
          IconElement={IconStats}
          text={t("common.stats.title_charts_and_stats")}
        />
      </HeaderDropdownMenu>
    </Dropdown>
  );
});

export default HeaderNavDropdown;
