// @generated
// Automatically generated. Don't change this file manually.

import FtEventKind from "./ft-event-kind";
import { ReceiptsId } from "./receipts";

export default interface AssetsFungibleTokenEvents {
  /** Primary key. Index: assets__fungible_token_events_pkey */
  emitted_for_receipt_id: ReceiptsId;

  /**
   * Index: assets__fungible_token_events_block_timestamp_idx
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_at_block_timestamp: string;

  /** Index: assets__fungible_token_events_sorting_idx */
  emitted_in_shard_id: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_index_of_event_entry_in_shard: number;

  /** Index: assets__ft_contract_id_idx */
  emitted_by_contract_account_id: string;

  amount: string;

  event_kind: FtEventKind;

  /** Index: assets__fungible_token_events_old_owner_account_id_idx */
  token_old_owner_account_id: string;

  /** Index: assets__fungible_token_events_new_owner_account_id_idx */
  token_new_owner_account_id: string;

  event_memo: string;
}

export interface AssetsFungibleTokenEventsInitializer {
  /** Primary key. Index: assets__fungible_token_events_pkey */
  emitted_for_receipt_id: ReceiptsId;

  /**
   * Index: assets__fungible_token_events_block_timestamp_idx
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_at_block_timestamp: string;

  /** Index: assets__fungible_token_events_sorting_idx */
  emitted_in_shard_id: string;

  /**
   * Primary key. Index: assets__fungible_token_events_pkey
   * Index: assets__fungible_token_events_sorting_idx
   */
  emitted_index_of_event_entry_in_shard: number;

  /** Index: assets__ft_contract_id_idx */
  emitted_by_contract_account_id: string;

  amount: string;

  event_kind: FtEventKind;

  /**
   * Default value: ''::text
   * Index: assets__fungible_token_events_old_owner_account_id_idx
   */
  token_old_owner_account_id?: string;

  /**
   * Default value: ''::text
   * Index: assets__fungible_token_events_new_owner_account_id_idx
   */
  token_new_owner_account_id?: string;

  /** Default value: ''::text */
  event_memo?: string;
}
