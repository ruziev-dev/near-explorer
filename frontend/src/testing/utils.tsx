import * as React from "react";

import { i18n } from "i18next";
import fetch from "isomorphic-fetch";
import { setI18n } from "react-i18next";
import * as ReactQuery from "react-query";
import renderer, {
  ReactTestRenderer,
  TestRendererOptions,
} from "react-test-renderer";

import {
  LanguageContext,
  LanguageContextType,
} from "@explorer/frontend/context/LanguageContext";
import {
  NetworkContext,
  NetworkContextType,
} from "@explorer/frontend/context/NetworkContext";
import { Locale } from "@explorer/frontend/libraries/date-locale";
import { trpc } from "@explorer/frontend/libraries/trpc";

const networkContext: NetworkContextType = {
  networkName: "localnet",
  networks: {
    localnet: {
      explorerLink: "http://explorer/",
      nearWalletProfilePrefix: "http://wallet/profile",
    },
  },
};

// Variables were set in testing/env.ts
/* eslint-disable vars-on-top, no-var */
declare global {
  var i18nInstance: i18n;
  var locale: Locale;
}
/* eslint-enable vars-on-top, no-var */

export const renderElement = (
  nextElement: React.ReactNode,
  options?: TestRendererOptions
): ReactTestRenderer => {
  setI18n(global.i18nInstance);
  let root: ReactTestRenderer;
  const queryClient = new ReactQuery.QueryClient();
  const client = trpc.createClient({
    url: "http://localhost/",
    fetch,
  });
  const languageContext: LanguageContextType = {
    language: "en",
    setLanguage: () => {},
    locale: global.locale,
  };
  renderer.act(() => {
    root = renderer.create(
      <trpc.Provider queryClient={queryClient} client={client}>
        <ReactQuery.QueryClientProvider client={queryClient}>
          <LanguageContext.Provider value={languageContext}>
            <NetworkContext.Provider value={networkContext}>
              {nextElement}
            </NetworkContext.Provider>
          </LanguageContext.Provider>
        </ReactQuery.QueryClientProvider>
      </trpc.Provider>,
      options
    );
  });
  return root!;
};
