import { telemetryWriteDatabase } from "@explorer/backend/database/databases";

// Skip initializing Telemetry database if the backend is not configured to
// save telemetry data (it is absolutely fine for local development)
export const setupTelemetryDb = async () => {
  if (!telemetryWriteDatabase) {
    return;
  }
  await telemetryWriteDatabase.schema
    .createTable("nodes")
    .ifNotExists()
    .addColumn("ip_address", "varchar(255)", (col) => col.notNull())
    .addColumn("moniker", "varchar(255)", (col) => col.notNull())
    .addColumn("account_id", "varchar(255)", (col) => col.notNull())
    .addColumn("node_id", "varchar(255)", (col) => col.notNull().primaryKey())
    .addColumn("last_seen", "timestamptz", (col) => col.notNull())
    .addColumn("last_height", "bigint", (col) => col.notNull())
    .addColumn("agent_name", "varchar(255)", (col) => col.notNull())
    .addColumn("agent_version", "varchar(255)", (col) => col.notNull())
    .addColumn("agent_build", "varchar(255)", (col) => col.notNull())
    .addColumn("peer_count", "varchar(255)", (col) => col.notNull())
    .addColumn("is_validator", "boolean", (col) => col.notNull())
    .addColumn("last_hash", "varchar(255)", (col) => col.notNull())
    .addColumn("signature", "varchar(255)", (col) => col.notNull())
    .addColumn("status", "varchar(255)", (col) => col.notNull())
    .addColumn("latitude", "numeric(8, 6)")
    .addColumn("longitude", "numeric(9, 6)")
    .addColumn("city", "varchar(255)")

    .addColumn("bandwidth_download", "float4")
    .addColumn("bandwidth_upload", "float4")
    .addColumn("cpu_usage", "float4")
    .addColumn("memory_usage", "int8")
    .addColumn("boot_time_seconds", "timestamptz")

    .addColumn("block_production_tracking_delay", "float4")
    .addColumn("min_block_production_delay", "float4")
    .addColumn("max_block_production_delay", "float4")
    .addColumn("max_block_wait_delay", "float4")
    .execute();
};
