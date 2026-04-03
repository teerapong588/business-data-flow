import { DataFlowEdge } from "@/types/flow";

export const edges: DataFlowEdge[] = [
  // ── Trade Lifecycle Flow ──
  {
    id: "e-market-data-oms",
    source: "market-data",
    target: "oms",
    data: {
      label: "Market Data → OMS",
      dataDescription: "Real-time pricing data for order management",
      frequency: "Real-time streaming",
      protocol: "Bloomberg B-PIPE",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-oms-compliance",
    source: "oms",
    target: "pre-trade-compliance",
    data: {
      label: "Orders → Compliance",
      dataDescription: "Trade orders for pre-trade compliance validation",
      frequency: "Real-time (per order)",
      protocol: "Internal API",
      flowTypes: ["trade-lifecycle", "compliance-monitoring"],
    },
  },
  {
    id: "e-compliance-oms",
    source: "pre-trade-compliance",
    target: "oms",
    data: {
      label: "Compliance → OMS",
      dataDescription: "Approval/rejection results back to OMS",
      frequency: "Real-time",
      protocol: "Internal API",
      flowTypes: ["trade-lifecycle", "compliance-monitoring"],
    },
  },
  {
    id: "e-oms-ems",
    source: "oms",
    target: "ems",
    data: {
      label: "Orders → Execution",
      dataDescription: "Approved orders routed for execution",
      frequency: "Real-time",
      protocol: "FIX 4.4",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-ems-broker",
    source: "ems",
    target: "broker-dealer",
    data: {
      label: "Execution → Broker",
      dataDescription: "Order routing to sell-side for execution",
      frequency: "Real-time",
      protocol: "FIX 4.4 / FIX 5.0",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-broker-ems",
    source: "broker-dealer",
    target: "ems",
    data: {
      label: "Fills → EMS",
      dataDescription: "Execution reports and fill confirmations",
      frequency: "Real-time",
      protocol: "FIX 4.4",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-ems-matching",
    source: "ems",
    target: "trade-matching",
    data: {
      label: "Trades → Matching",
      dataDescription: "Executed trade details for post-trade matching",
      frequency: "Real-time (T+0)",
      protocol: "DTCC CTM",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-matching-settlement",
    source: "trade-matching",
    target: "settlement",
    data: {
      label: "Matched → Settlement",
      dataDescription: "Confirmed matched trades for settlement",
      frequency: "T+0 / T+1",
      protocol: "Internal",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-settlement-custodian",
    source: "settlement",
    target: "custodian",
    data: {
      label: "Settlement → Custodian",
      dataDescription: "Settlement instructions to global custodian",
      frequency: "T+1 / T+2",
      protocol: "SWIFT MT5xx",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "e-custodian-settlement",
    source: "custodian",
    target: "settlement",
    data: {
      label: "Confirmations",
      dataDescription: "Settlement confirmations from custodian",
      frequency: "Real-time + EOD",
      protocol: "SWIFT MT5xx",
      flowTypes: ["trade-lifecycle"],
    },
  },

  // ── NAV Calculation Flow ──
  {
    id: "e-pricing-nav",
    source: "pricing-service",
    target: "nav-engine",
    data: {
      label: "EOD Prices → NAV",
      dataDescription: "End-of-day evaluated prices for NAV calculation",
      frequency: "Daily batch 17:00 UTC",
      protocol: "SFTP",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-settlement-accounting",
    source: "settlement",
    target: "fund-accounting",
    data: {
      label: "Settled Trades → Accounting",
      dataDescription: "Settled trade details for general ledger posting",
      frequency: "Daily (T+1)",
      protocol: "Internal Batch",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-ca-accounting",
    source: "corporate-actions",
    target: "fund-accounting",
    data: {
      label: "Corp Actions → Accounting",
      dataDescription: "Dividend accruals, stock splits, and CA processing results",
      frequency: "Event-driven",
      protocol: "Internal",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-accounting-nav",
    source: "fund-accounting",
    target: "nav-engine",
    data: {
      label: "GL Balances → NAV",
      dataDescription: "Fund-level balances and expense accruals for NAV",
      frequency: "Daily",
      protocol: "Internal Batch",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-nav-client-reporting",
    source: "nav-engine",
    target: "client-reporting",
    data: {
      label: "NAV → Client Reports",
      dataDescription: "NAV per share data for investor reports",
      frequency: "Daily",
      protocol: "Internal",
      flowTypes: ["nav-calculation", "client-reporting"],
    },
  },
  {
    id: "e-nav-regulatory",
    source: "nav-engine",
    target: "regulatory-reporting",
    data: {
      label: "NAV → Regulatory",
      dataDescription: "Fund valuations for regulatory filings",
      frequency: "Daily / Periodic",
      protocol: "Internal",
      flowTypes: ["nav-calculation", "compliance-monitoring"],
    },
  },
  {
    id: "e-custodian-ca",
    source: "custodian",
    target: "corporate-actions",
    data: {
      label: "CA Notifications",
      dataDescription: "Corporate action event notifications from custodian",
      frequency: "Event-driven",
      protocol: "SWIFT MT564",
      flowTypes: ["nav-calculation"],
    },
  },

  // ── Risk Management Flow ──
  {
    id: "e-pms-risk",
    source: "pms",
    target: "risk-platform",
    data: {
      label: "Positions → Risk",
      dataDescription: "Portfolio positions and exposures for risk analysis",
      frequency: "Real-time + EOD",
      protocol: "REST API",
      flowTypes: ["risk-management"],
    },
  },
  {
    id: "e-market-data-risk",
    source: "market-data",
    target: "risk-platform",
    data: {
      label: "Market Data → Risk",
      dataDescription: "Real-time market data for VaR and stress testing",
      frequency: "Real-time",
      protocol: "Bloomberg B-PIPE",
      flowTypes: ["risk-management"],
    },
  },
  {
    id: "e-risk-pms",
    source: "risk-platform",
    target: "pms",
    data: {
      label: "Risk Metrics → PM",
      dataDescription: "VaR, tracking error, and limit utilization back to PM",
      frequency: "Real-time",
      protocol: "Internal API",
      flowTypes: ["risk-management"],
    },
  },
  {
    id: "e-counterparty-risk",
    source: "counterparty-risk",
    target: "risk-platform",
    data: {
      label: "Credit → Risk",
      dataDescription: "Counterparty credit exposures and limit data",
      frequency: "Daily",
      protocol: "Internal API",
      flowTypes: ["risk-management"],
    },
  },
  {
    id: "e-risk-regulatory",
    source: "risk-platform",
    target: "regulatory-reporting",
    data: {
      label: "Risk → Regulatory",
      dataDescription: "Risk reports for Form PF and AIFMD filings",
      frequency: "Periodic",
      protocol: "Internal Batch",
      flowTypes: ["risk-management", "compliance-monitoring"],
    },
  },

  // ── Compliance Monitoring Flow ──
  {
    id: "e-ems-surveillance",
    source: "ems",
    target: "trade-surveillance",
    data: {
      label: "Executions → Surveillance",
      dataDescription: "Trade execution data for market abuse detection",
      frequency: "Real-time",
      protocol: "Internal Feed",
      flowTypes: ["compliance-monitoring"],
    },
  },
  {
    id: "e-kyc-oms",
    source: "kyc-aml",
    target: "oms",
    data: {
      label: "KYC Status → OMS",
      dataDescription: "Client approval status and trading restrictions",
      frequency: "Event-driven",
      protocol: "REST API",
      flowTypes: ["compliance-monitoring"],
    },
  },

  // ── Reconciliation & Operations ──
  {
    id: "e-custodian-recon",
    source: "custodian",
    target: "reconciliation",
    data: {
      label: "Custodian Positions",
      dataDescription: "Custodian-held positions for reconciliation",
      frequency: "Daily (T+1)",
      protocol: "SFTP",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-accounting-recon",
    source: "fund-accounting",
    target: "reconciliation",
    data: {
      label: "Internal Positions",
      dataDescription: "Internal book positions for reconciliation matching",
      frequency: "Daily (T+1)",
      protocol: "Internal Batch",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "e-recon-dw",
    source: "reconciliation",
    target: "data-warehouse",
    data: {
      label: "Recon Results → DW",
      dataDescription: "Reconciliation results and break analysis",
      frequency: "Daily",
      protocol: "ETL / Snowflake Connector",
      flowTypes: ["client-reporting"],
    },
  },

  // ── Client Reporting Flow ──
  {
    id: "e-dw-client-reporting",
    source: "data-warehouse",
    target: "client-reporting",
    data: {
      label: "Analytics → Reports",
      dataDescription: "Consolidated analytics data for report generation",
      frequency: "Daily / Monthly",
      protocol: "SQL / dbt",
      flowTypes: ["client-reporting"],
    },
  },
  {
    id: "e-pms-client-reporting",
    source: "pms",
    target: "client-reporting",
    data: {
      label: "Performance → Reports",
      dataDescription: "Performance attribution and portfolio analytics",
      frequency: "Daily / Monthly",
      protocol: "REST API",
      flowTypes: ["client-reporting"],
    },
  },
  {
    id: "e-dw-regulatory",
    source: "data-warehouse",
    target: "regulatory-reporting",
    data: {
      label: "DW → Regulatory",
      dataDescription: "Consolidated data for regulatory report generation",
      frequency: "Periodic",
      protocol: "SQL / dbt",
      flowTypes: ["compliance-monitoring"],
    },
  },

  // ── Cross-system ──
  {
    id: "e-market-data-pms",
    source: "market-data",
    target: "pms",
    data: {
      label: "Market Data → PM",
      dataDescription: "Real-time pricing for portfolio valuation",
      frequency: "Real-time",
      protocol: "Bloomberg API",
      flowTypes: ["risk-management", "nav-calculation"],
    },
  },
  {
    id: "e-pms-dw",
    source: "pms",
    target: "data-warehouse",
    data: {
      label: "Positions → DW",
      dataDescription: "Portfolio positions and analytics to data warehouse",
      frequency: "EOD batch",
      protocol: "ETL / REST API",
      flowTypes: ["client-reporting"],
    },
  },
  {
    id: "e-pricing-pms",
    source: "pricing-service",
    target: "pms",
    data: {
      label: "Prices → PM",
      dataDescription: "Evaluated pricing for portfolio analytics",
      frequency: "Daily",
      protocol: "SFTP",
      flowTypes: ["nav-calculation"],
    },
  },
];
