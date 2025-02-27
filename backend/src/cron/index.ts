import { Context } from "@explorer/backend/context";
import * as tasks from "@explorer/backend/cron/tasks";
import { PublishTopic } from "@explorer/backend/cron/types";
import { SECOND } from "@explorer/backend/utils/time";

const regularTasks = [
  tasks.latestBlockCheck,
  tasks.latestGasPriceCheck,
  tasks.blockProductionSpeedCheck,
  tasks.recentTransactionsCountCheck,
  tasks.onlineNodesCountCheck,
  tasks.genesisProtocolInfoFetch,
  tasks.transactionsHistoryCheck,
  tasks.gasUsedHistoryCheck,
  tasks.contractsHistoryCheck,
  tasks.activeContractsHistoryCheck,
  tasks.activeContractsListCheck,
  tasks.accountsHistoryCheck,
  tasks.activeAccountsHistoryCheck,
  tasks.activeAccountsListCheck,
  tasks.networkInfoCheck,
  tasks.stakingPoolMetadataInfoCheck,
  tasks.poolIdsCheck,
  tasks.tokensSupplyCheck,
  tasks.rpcStatusCheck,
  tasks.indexerStatusCheck,
];

export const runTasks = (context: Context) => {
  const publish: PublishTopic = (topic, output) => {
    // TODO: Find a proper version of TypedEmitter
    // @ts-ignore
    context.subscriptionsCache[topic] = output;
    // @ts-ignore
    void context.subscriptionsEventEmitter.emit(topic, output);
  };
  const timeouts: Record<string, NodeJS.Timeout> = {};
  Object.values(regularTasks).forEach((task) => {
    if (task.shouldSkip?.()) {
      return;
    }

    let timeout = SECOND;
    const runTask = async () => {
      try {
        timeout = await task.fn(publish, context);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          `Regular ${task.description} crashed due to:`,
          String(error)
        );
      } finally {
        if (timeout !== Infinity) {
          timeouts[task.description] = setTimeout(runTask, timeout);
        }
      }
    };
    void runTask();
  });
  return () => {
    const timeoutIds = Object.values(timeouts);
    timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  };
};
