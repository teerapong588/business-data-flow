import type {
  FlowProject,
  DepartmentConfig,
  BusinessFunctionConfig,
  FlowTypeConfig,
  SystemFlowNode,
  DataFlowEdge,
} from "@/types/flow";

// ── Departments (real org departments) ──────────────────────────────────────

const templateDepartments: DepartmentConfig[] = [
  {
    id: "fund-management",
    label: "Fund Management",
    color: "#3b82f6",
    glowColor: "0 0 20px rgba(59,130,246,0.3)",
    glowIntense:
      "0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2)",
    icon: "TrendingUp",
  },
  {
    id: "operations",
    label: "Operations",
    color: "#14b8a6",
    glowColor: "0 0 20px rgba(20,184,166,0.3)",
    glowIntense:
      "0 0 30px rgba(20,184,166,0.5), 0 0 60px rgba(20,184,166,0.2)",
    icon: "Settings",
  },
  {
    id: "compliance",
    label: "Compliance",
    color: "#a855f7",
    glowColor: "0 0 20px rgba(168,85,247,0.3)",
    glowIntense:
      "0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(168,85,247,0.2)",
    icon: "Shield",
  },
  {
    id: "technology",
    label: "Technology",
    color: "#64748b",
    glowColor: "0 0 20px rgba(100,116,139,0.3)",
    glowIntense:
      "0 0 30px rgba(100,116,139,0.5), 0 0 60px rgba(100,116,139,0.2)",
    icon: "Server",
  },
  {
    id: "external",
    label: "External",
    color: "#f43f5e",
    glowColor: "0 0 20px rgba(244,63,94,0.3)",
    glowIntense:
      "0 0 30px rgba(244,63,94,0.5), 0 0 60px rgba(244,63,94,0.2)",
    icon: "Globe",
  },
];

// ── Functions (activities within departments) ───────────────────────────────

const templateFunctions: BusinessFunctionConfig[] = [
  // Fund Management
  {
    id: "trading",
    label: "Trading",
    departmentId: "fund-management",
    color: "#3b82f6",
  },
  {
    id: "portfolio-management",
    label: "Portfolio Mgmt",
    departmentId: "fund-management",
    color: "#6366f1",
  },
  {
    id: "risk",
    label: "Risk",
    departmentId: "fund-management",
    color: "#f59e0b",
  },
  // Operations
  {
    id: "settlement-ops",
    label: "Settlement",
    departmentId: "operations",
    color: "#14b8a6",
  },
  {
    id: "fund-accounting",
    label: "Fund Accounting",
    departmentId: "operations",
    color: "#0d9488",
  },
  {
    id: "asset-servicing",
    label: "Asset Servicing",
    departmentId: "operations",
    color: "#0f766e",
  },
  {
    id: "reconciliation-ops",
    label: "Reconciliation",
    departmentId: "operations",
    color: "#115e59",
  },
  // Compliance
  {
    id: "pre-trade-compliance",
    label: "Pre-Trade Compliance",
    departmentId: "compliance",
    color: "#a855f7",
  },
  {
    id: "surveillance",
    label: "Surveillance",
    departmentId: "compliance",
    color: "#9333ea",
  },
  {
    id: "regulatory",
    label: "Regulatory",
    departmentId: "compliance",
    color: "#7c3aed",
  },
  {
    id: "client-due-diligence",
    label: "Client Due Diligence",
    departmentId: "compliance",
    color: "#6d28d9",
  },
  // Technology
  {
    id: "data-engineering",
    label: "Data Engineering",
    departmentId: "technology",
    color: "#64748b",
  },
  // External
  {
    id: "market-data-provider",
    label: "Market Data",
    departmentId: "external",
    color: "#f43f5e",
  },
  {
    id: "broker-connectivity",
    label: "Broker Connectivity",
    departmentId: "external",
    color: "#e11d48",
  },
  {
    id: "custody-services",
    label: "Custody Services",
    departmentId: "external",
    color: "#be123c",
  },
  // Reporting (as a function under Fund Management)
  {
    id: "reporting",
    label: "Reporting",
    departmentId: "fund-management",
    color: "#10b981",
  },
];

// ── Flow Types ──────────────────────────────────────────────────────────────

const templateFlowTypes: FlowTypeConfig[] = [
  {
    id: "trade-lifecycle",
    label: "Trade Lifecycle",
    description: "End-to-end trade flow from order to settlement",
  },
  {
    id: "nav-calculation",
    label: "NAV Calculation",
    description: "Daily Net Asset Value computation pipeline",
  },
  {
    id: "risk-management",
    label: "Risk Management",
    description: "Real-time risk monitoring and reporting",
  },
  {
    id: "compliance-monitoring",
    label: "Compliance",
    description: "Regulatory compliance and surveillance",
  },
  {
    id: "client-reporting",
    label: "Client Reporting",
    description: "Performance reports and client communications",
  },
];

// ── Nodes (remapped to two-level hierarchy) ─────────────────────────────────

const templateNodes: SystemFlowNode[] = [
  // External
  {
    id: "market-data",
    type: "system",
    position: { x: 0, y: 0 },
    data: {
      label: "Market Data Feed",
      department: "external",
      function: "market-data-provider",
      systemName: "Bloomberg / Reuters",
      owner: "Market Data Team",
      description:
        "Real-time and historical market data including prices, indices, FX rates, and news.",
      dataTypes: ["Equity Prices", "FX Rates", "Index Data", "Volatility Surfaces"],
      schedule: "Real-time streaming",
      protocol: "Bloomberg B-PIPE / RMDS",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "risk-management", "nav-calculation"],
    },
  },
  {
    id: "pricing-service",
    type: "system",
    position: { x: 0, y: 180 },
    data: {
      label: "Pricing Service",
      department: "external",
      function: "market-data-provider",
      systemName: "Bloomberg BVAL / ICE",
      owner: "Valuations Team",
      description:
        "End-of-day evaluated pricing for fixed income, derivatives, and illiquid securities.",
      dataTypes: ["EOD Prices", "Evaluated Prices", "Yield Curves"],
      schedule: "Daily batch 17:00 UTC",
      protocol: "SFTP / REST API",
      criticality: "high",
      flowTypes: ["nav-calculation"],
    },
  },
  {
    id: "broker-dealer",
    type: "system",
    position: { x: 0, y: 360 },
    data: {
      label: "Broker / Dealer",
      department: "external",
      function: "broker-connectivity",
      systemName: "Multi-Broker Gateway",
      owner: "Trading Desk",
      description:
        "Electronic connectivity to sell-side brokers for trade execution across asset classes.",
      dataTypes: ["Execution Reports", "Market Depth", "IOIs"],
      schedule: "Real-time",
      protocol: "FIX 4.4 / FIX 5.0",
      criticality: "high",
      flowTypes: ["trade-lifecycle"],
    },
  },
  {
    id: "custodian",
    type: "system",
    position: { x: 0, y: 540 },
    data: {
      label: "Custodian",
      department: "external",
      function: "custody-services",
      systemName: "BNY Mellon / State Street",
      owner: "Operations - Custody",
      description:
        "Global custodian providing safekeeping, settlement, and asset servicing.",
      dataTypes: [
        "Settlement Confirmations",
        "Custody Positions",
        "Corporate Actions",
      ],
      schedule: "Real-time + Daily batch",
      protocol: "SWIFT MT / ISO 20022",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "nav-calculation"],
    },
  },

  // Fund Management - Trading
  {
    id: "oms",
    type: "system",
    position: { x: 450, y: 0 },
    data: {
      label: "Order Management",
      department: "fund-management",
      function: "trading",
      systemName: "CRD (Charles River)",
      owner: "Trading Desk - Equities",
      description:
        "Central hub for trade order creation, management, and allocation across all strategies.",
      dataTypes: ["Trade Orders", "Allocations", "Compliance Results"],
      schemas: [
        {
          id: "trade-order",
          name: "Trade Order",
          fields: [
            { id: "order_id", name: "Order ID", type: "string", required: true },
            { id: "symbol", name: "Symbol", type: "string", required: true },
            { id: "side", name: "Side", type: "string", required: true },
            { id: "quantity", name: "Quantity", type: "number", required: true },
            { id: "price", name: "Price", type: "number" },
            { id: "order_type", name: "Order Type", type: "string", required: true },
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "timestamp", name: "Timestamp", type: "date", required: true },
            { id: "status", name: "Status", type: "string", required: true },
          ],
        },
        {
          id: "allocation",
          name: "Allocation",
          fields: [
            { id: "alloc_id", name: "Allocation ID", type: "string", required: true },
            { id: "order_id", name: "Order ID", type: "string", required: true },
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "quantity", name: "Quantity", type: "number", required: true },
            { id: "account_id", name: "Account ID", type: "string", required: true },
          ],
        },
        {
          id: "compliance-result",
          name: "Compliance Result",
          fields: [
            { id: "order_id", name: "Order ID", type: "string", required: true },
            { id: "rule_id", name: "Rule ID", type: "string", required: true },
            { id: "status", name: "Status", type: "string", required: true },
            { id: "breach_detail", name: "Breach Detail", type: "string" },
          ],
        },
      ],
      schedule: "Real-time",
      protocol: "FIX 4.4 / REST API",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "compliance-monitoring"],
    },
  },
  {
    id: "ems",
    type: "system",
    position: { x: 450, y: 160 },
    data: {
      label: "Execution Mgmt",
      department: "fund-management",
      function: "trading",
      systemName: "FlexTrade",
      owner: "Trading Desk - Execution",
      description:
        "Smart order routing and algorithmic execution across venues and dark pools.",
      dataTypes: ["Execution Reports", "Fill Data", "TCA Metrics"],
      schemas: [
        {
          id: "execution-order",
          name: "Execution Order",
          fields: [
            { id: "order_id", name: "Order ID", type: "string", required: true },
            { id: "symbol", name: "Symbol", type: "string", required: true },
            { id: "side", name: "Side", type: "string", required: true },
            { id: "quantity", name: "Quantity", type: "number", required: true },
            { id: "exec_venue", name: "Execution Venue", type: "string" },
            { id: "algo_type", name: "Algorithm Type", type: "string" },
          ],
        },
        {
          id: "fill",
          name: "Fill",
          fields: [
            { id: "fill_id", name: "Fill ID", type: "string", required: true },
            { id: "order_id", name: "Order ID", type: "string", required: true },
            { id: "exec_price", name: "Execution Price", type: "number", required: true },
            { id: "exec_qty", name: "Executed Quantity", type: "number", required: true },
            { id: "venue", name: "Venue", type: "string", required: true },
            { id: "timestamp", name: "Timestamp", type: "date", required: true },
          ],
        },
      ],
      schedule: "Real-time",
      protocol: "FIX 4.4",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "compliance-monitoring"],
    },
  },

  // Fund Management - Portfolio Management
  {
    id: "pms",
    type: "system",
    position: { x: 450, y: 400 },
    data: {
      label: "Portfolio Mgmt",
      department: "fund-management",
      function: "portfolio-management",
      systemName: "BlackRock Aladdin",
      owner: "Portfolio Management",
      description:
        "Portfolio construction, analytics, what-if scenarios, and performance attribution.",
      dataTypes: ["Portfolio Positions", "Risk Metrics", "Performance Data"],
      schedule: "Real-time + EOD batch",
      protocol: "REST API / Aladdin SDK",
      criticality: "high",
      flowTypes: ["risk-management", "client-reporting", "nav-calculation"],
    },
  },

  // Compliance
  {
    id: "pre-trade-compliance",
    type: "system",
    position: { x: 900, y: 0 },
    data: {
      label: "Pre-Trade Compliance",
      department: "compliance",
      function: "pre-trade-compliance",
      systemName: "Charles River Compliance",
      owner: "Compliance Team",
      description:
        "Real-time order validation against investment guidelines, regulatory limits, and restrictions.",
      dataTypes: ["Compliance Results", "Breach Alerts", "Rule Evaluations"],
      schedule: "Real-time (per order)",
      protocol: "Internal API",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "compliance-monitoring"],
    },
  },

  // Fund Management - Risk
  {
    id: "risk-platform",
    type: "system",
    position: { x: 450, y: 600 },
    data: {
      label: "Risk Platform",
      department: "fund-management",
      function: "risk",
      systemName: "MSCI RiskMetrics / Aladdin Risk",
      owner: "Risk Management",
      description:
        "VaR calculation, stress testing, exposure analytics, and factor risk decomposition.",
      dataTypes: ["VaR Reports", "Stress Test Results", "Exposure Data"],
      schemas: [
        {
          id: "var-report",
          name: "VaR Report",
          fields: [
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "var_95", name: "VaR 95%", type: "number", required: true },
            { id: "var_99", name: "VaR 99%", type: "number", required: true },
            { id: "calc_date", name: "Calculation Date", type: "date", required: true },
          ],
        },
        {
          id: "exposure",
          name: "Exposure Data",
          fields: [
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "asset_class", name: "Asset Class", type: "string", required: true },
            { id: "gross_exposure", name: "Gross Exposure", type: "number", required: true },
            { id: "net_exposure", name: "Net Exposure", type: "number", required: true },
            { id: "currency", name: "Currency", type: "string", required: true },
          ],
        },
      ],
      schedule: "Real-time + EOD batch",
      protocol: "REST API / Batch Files",
      criticality: "high",
      flowTypes: ["risk-management"],
    },
  },

  // Operations
  {
    id: "trade-matching",
    type: "system",
    position: { x: 1350, y: 0 },
    data: {
      label: "Trade Matching",
      department: "operations",
      function: "settlement-ops",
      systemName: "DTCC CTM / TradeSuite",
      owner: "Operations - Trade Support",
      description:
        "Post-trade matching and confirmation with counterparties and custodians.",
      dataTypes: ["Trade Confirmations", "Match Status", "Break Reports"],
      schedule: "Real-time (T+0)",
      protocol: "DTCC / SWIFT",
      criticality: "high",
      flowTypes: ["trade-lifecycle"],
    },
  },

  // Compliance - Surveillance
  {
    id: "trade-surveillance",
    type: "system",
    position: { x: 900, y: 200 },
    data: {
      label: "Trade Surveillance",
      department: "compliance",
      function: "surveillance",
      systemName: "Nasdaq Surveillance",
      owner: "Compliance - Surveillance",
      description:
        "Automated detection of market manipulation, insider trading, and best execution violations.",
      dataTypes: ["Surveillance Alerts", "Trade Patterns", "Exception Reports"],
      schedule: "Real-time + T+1 review",
      protocol: "Internal Feed",
      criticality: "medium",
      flowTypes: ["compliance-monitoring"],
    },
  },

  // Fund Management - Risk
  {
    id: "counterparty-risk",
    type: "system",
    position: { x: 450, y: 760 },
    data: {
      label: "Counterparty Risk",
      department: "fund-management",
      function: "risk",
      systemName: "Internal Credit System",
      owner: "Risk Management - Credit",
      description:
        "Credit exposure monitoring, counterparty limits, and collateral management.",
      dataTypes: ["Credit Exposures", "Limit Utilization", "Collateral Data"],
      schedule: "Daily batch",
      protocol: "Internal API",
      criticality: "medium",
      flowTypes: ["risk-management"],
    },
  },

  // Operations - Settlement
  {
    id: "settlement",
    type: "system",
    position: { x: 1350, y: 160 },
    data: {
      label: "Settlement",
      department: "operations",
      function: "settlement-ops",
      systemName: "Internal Settlement Engine",
      owner: "Operations - Settlement",
      description:
        "Settlement instruction generation, fail management, and delivery-vs-payment processing.",
      dataTypes: ["Settlement Instructions", "Fail Reports", "DVP Status"],
      schemas: [
        {
          id: "settlement-instruction",
          name: "Settlement Instruction",
          fields: [
            { id: "settle_id", name: "Settlement ID", type: "string", required: true },
            { id: "trade_id", name: "Trade ID", type: "string", required: true },
            { id: "settle_date", name: "Settlement Date", type: "date", required: true },
            { id: "amount", name: "Amount", type: "number", required: true },
            { id: "currency", name: "Currency", type: "string", required: true },
            { id: "counterparty", name: "Counterparty", type: "string", required: true },
            { id: "status", name: "Status", type: "string", required: true },
          ],
        },
      ],
      schedule: "Real-time (T+1/T+2)",
      protocol: "SWIFT MT5xx / ISO 20022",
      criticality: "high",
      flowTypes: ["trade-lifecycle", "nav-calculation"],
    },
  },

  // Operations - Fund Accounting
  {
    id: "fund-accounting",
    type: "system",
    position: { x: 1350, y: 400 },
    data: {
      label: "Fund Accounting",
      department: "operations",
      function: "fund-accounting",
      systemName: "Hi-Port",
      owner: "Fund Accounting Team",
      description:
        "General ledger, fund-level bookkeeping, expense accruals, and income allocation.",
      dataTypes: ["GL Balances", "Trial Balance", "Expense Accruals"],
      schemas: [
        {
          id: "gl-balance",
          name: "GL Balance",
          fields: [
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "account_code", name: "Account Code", type: "string", required: true },
            { id: "balance", name: "Balance", type: "number", required: true },
            { id: "currency", name: "Currency", type: "string", required: true },
            { id: "as_of_date", name: "As of Date", type: "date", required: true },
          ],
        },
        {
          id: "expense-accrual",
          name: "Expense Accrual",
          fields: [
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "expense_type", name: "Expense Type", type: "string", required: true },
            { id: "accrued_amount", name: "Accrued Amount", type: "number", required: true },
            { id: "period_start", name: "Period Start", type: "date", required: true },
            { id: "period_end", name: "Period End", type: "date", required: true },
          ],
        },
      ],
      schedule: "Daily batch (T+1)",
      protocol: "Batch / REST API",
      criticality: "high",
      flowTypes: ["nav-calculation"],
    },
  },

  // Operations - Fund Accounting
  {
    id: "nav-engine",
    type: "system",
    position: { x: 1350, y: 560 },
    data: {
      label: "NAV Calculation",
      department: "operations",
      function: "fund-accounting",
      systemName: "NAV Engine",
      owner: "Fund Accounting - NAV",
      description:
        "Daily Net Asset Value computation, pricing validation, and NAV dissemination.",
      dataTypes: ["NAV per Share", "Component Valuations", "Pricing Exceptions"],
      schemas: [
        {
          id: "nav-per-share",
          name: "NAV per Share",
          fields: [
            { id: "fund_id", name: "Fund ID", type: "string", required: true },
            { id: "nav_date", name: "NAV Date", type: "date", required: true },
            { id: "nav_value", name: "NAV Value", type: "number", required: true },
            { id: "shares_outstanding", name: "Shares Outstanding", type: "number", required: true },
            { id: "nav_per_share", name: "NAV per Share", type: "number", required: true },
            { id: "currency", name: "Currency", type: "string", required: true },
          ],
        },
        {
          id: "pricing-exception",
          name: "Pricing Exception",
          fields: [
            { id: "security_id", name: "Security ID", type: "string", required: true },
            { id: "exception_type", name: "Exception Type", type: "string", required: true },
            { id: "stale_price", name: "Stale Price", type: "number" },
            { id: "new_price", name: "New Price", type: "number" },
            { id: "resolution", name: "Resolution", type: "string" },
          ],
        },
      ],
      schedule: "Daily batch 18:00 UTC",
      protocol: "Internal Batch",
      criticality: "high",
      flowTypes: ["nav-calculation", "client-reporting"],
    },
  },

  // Operations - Asset Servicing
  {
    id: "corporate-actions",
    type: "system",
    position: { x: 1350, y: 920 },
    data: {
      label: "Corporate Actions",
      department: "operations",
      function: "asset-servicing",
      systemName: "CA Processing Engine",
      owner: "Operations - Asset Servicing",
      description:
        "Processing of dividends, stock splits, mergers, rights issues, and other corporate events.",
      dataTypes: ["CA Events", "Elections", "Entitlements"],
      schedule: "Event-driven + Daily",
      protocol: "SWIFT MT564 / ISO 20022",
      criticality: "medium",
      flowTypes: ["nav-calculation"],
    },
  },

  // Operations - Reconciliation
  {
    id: "reconciliation",
    type: "system",
    position: { x: 1350, y: 1120 },
    data: {
      label: "Reconciliation",
      department: "operations",
      function: "reconciliation-ops",
      systemName: "Duco / SmartStream",
      owner: "Operations - Reconciliation",
      description:
        "Daily position, cash, and transaction reconciliation between internal systems and custodians.",
      dataTypes: ["Recon Results", "Break Reports", "Cash Movements"],
      schedule: "Daily batch (T+1 06:00 UTC)",
      protocol: "SFTP / Internal API",
      criticality: "medium",
      flowTypes: ["nav-calculation"],
    },
  },

  // Operations - Portfolio Administration
  {
    id: "bara",
    type: "system",
    position: { x: 1350, y: 720 },
    data: {
      label: "Portfolio Admin",
      department: "operations",
      function: "fund-accounting",
      systemName: "Bara",
      owner: "Operations - Portfolio Admin",
      description:
        "Portfolio administration platform for position keeping, transaction processing, and investor reporting.",
      dataTypes: ["Positions", "Transactions", "Investor Records", "Fee Calculations"],
      schedule: "Daily batch + Real-time",
      protocol: "REST API / Batch",
      criticality: "high",
      flowTypes: ["nav-calculation", "client-reporting"],
    },
  },

  // Compliance - Client Due Diligence
  {
    id: "kyc-aml",
    type: "system",
    position: { x: 900, y: 400 },
    data: {
      label: "KYC / AML",
      department: "compliance",
      function: "client-due-diligence",
      systemName: "Refinitiv World-Check",
      owner: "Compliance - Client Due Diligence",
      description:
        "Client onboarding screening, ongoing monitoring, and sanctions checking.",
      dataTypes: ["Client Status", "Screening Results", "SAR Filings"],
      schedule: "Event-driven + Daily",
      protocol: "REST API",
      criticality: "medium",
      flowTypes: ["compliance-monitoring"],
    },
  },

  // Fund Management - Reporting
  {
    id: "client-reporting",
    type: "system",
    position: { x: 450, y: 960 },
    data: {
      label: "Client Reporting",
      department: "fund-management",
      function: "reporting",
      systemName: "Advent Geneva / Custom BI",
      owner: "Client Services",
      description:
        "Automated generation of factsheets, performance reports, and investor communications.",
      dataTypes: ["Factsheets", "Performance Reports", "Investor Letters"],
      schedule: "Monthly + Ad-hoc",
      protocol: "Internal / PDF / Portal",
      criticality: "medium",
      flowTypes: ["client-reporting"],
    },
  },

  // Compliance - Regulatory
  {
    id: "regulatory-reporting",
    type: "system",
    position: { x: 900, y: 600 },
    data: {
      label: "Regulatory Reporting",
      department: "compliance",
      function: "regulatory",
      systemName: "Regulatory Engine",
      owner: "Compliance - Regulatory",
      description:
        "Automated filing of Form PF, AIFMD Annex IV, MiFID II, and other regulatory reports.",
      dataTypes: ["Form PF", "AIFMD Annex IV", "Transaction Reports"],
      schedule: "Periodic (quarterly/annual)",
      protocol: "XBRL / XML / Portal Upload",
      criticality: "high",
      flowTypes: ["compliance-monitoring", "risk-management"],
    },
  },

  // Technology - Data Engineering
  {
    id: "data-warehouse",
    type: "system",
    position: { x: 1700, y: 0 },
    data: {
      label: "Data Warehouse",
      department: "technology",
      function: "data-engineering",
      systemName: "Snowflake / Internal DW",
      owner: "Data Engineering",
      description:
        "Central analytics repository consolidating data from all upstream systems for BI and reporting.",
      dataTypes: [
        "Consolidated Positions",
        "Historical Trades",
        "Analytics Data",
      ],
      schedule: "Daily ETL (T+1)",
      protocol: "Snowflake Connector / dbt",
      criticality: "medium",
      flowTypes: ["client-reporting"],
    },
  },
];

// ── Edges (unchanged from original) ─────────────────────────────────────────

const templateEdges: DataFlowEdge[] = [
  // Trade Lifecycle
  { id: "e-market-data-oms", source: "market-data", target: "oms", data: { label: "Market Data \u2192 OMS", dataDescription: "Real-time pricing data for order management", frequency: "Real-time streaming", protocol: "Bloomberg B-PIPE", flowTypes: ["trade-lifecycle"] } },
  { id: "e-oms-compliance", source: "oms", target: "pre-trade-compliance", data: { label: "Orders \u2192 Compliance", dataDescription: "Trade orders for pre-trade compliance validation", frequency: "Real-time (per order)", protocol: "Internal API", flowTypes: ["trade-lifecycle", "compliance-monitoring"], fieldMappings: [{ sourceSchemaId: "trade-order", sourceFieldIds: ["order_id", "symbol", "side", "quantity", "price", "fund_id"] }] } },
  { id: "e-compliance-oms", source: "pre-trade-compliance", target: "oms", data: { label: "Compliance \u2192 OMS", dataDescription: "Approval/rejection results back to OMS", frequency: "Real-time", protocol: "Internal API", flowTypes: ["trade-lifecycle", "compliance-monitoring"] } },
  { id: "e-oms-ems", source: "oms", target: "ems", data: { label: "Orders \u2192 Execution", dataDescription: "Approved orders routed for execution", frequency: "Real-time", protocol: "FIX 4.4", flowTypes: ["trade-lifecycle"], fieldMappings: [{ sourceSchemaId: "trade-order", sourceFieldIds: ["order_id", "symbol", "side", "quantity", "price", "order_type"], targetSchemaId: "execution-order" }] } },
  { id: "e-ems-broker", source: "ems", target: "broker-dealer", data: { label: "Execution \u2192 Broker", dataDescription: "Order routing to sell-side for execution", frequency: "Real-time", protocol: "FIX 4.4 / FIX 5.0", flowTypes: ["trade-lifecycle"] } },
  { id: "e-broker-ems", source: "broker-dealer", target: "ems", data: { label: "Fills \u2192 EMS", dataDescription: "Execution reports and fill confirmations", frequency: "Real-time", protocol: "FIX 4.4", flowTypes: ["trade-lifecycle"] } },
  { id: "e-ems-matching", source: "ems", target: "trade-matching", data: { label: "Trades \u2192 Matching", dataDescription: "Executed trade details for post-trade matching", frequency: "Real-time (T+0)", protocol: "DTCC CTM", flowTypes: ["trade-lifecycle"] } },
  { id: "e-matching-settlement", source: "trade-matching", target: "settlement", data: { label: "Matched \u2192 Settlement", dataDescription: "Confirmed matched trades for settlement", frequency: "T+0 / T+1", protocol: "Internal", flowTypes: ["trade-lifecycle"] } },
  { id: "e-settlement-custodian", source: "settlement", target: "custodian", data: { label: "Settlement \u2192 Custodian", dataDescription: "Settlement instructions to global custodian", frequency: "T+1 / T+2", protocol: "SWIFT MT5xx", flowTypes: ["trade-lifecycle"] } },
  { id: "e-custodian-settlement", source: "custodian", target: "settlement", data: { label: "Confirmations", dataDescription: "Settlement confirmations from custodian", frequency: "Real-time + EOD", protocol: "SWIFT MT5xx", flowTypes: ["trade-lifecycle"] } },

  // NAV Calculation
  { id: "e-pricing-nav", source: "pricing-service", target: "nav-engine", data: { label: "EOD Prices \u2192 NAV", dataDescription: "End-of-day evaluated prices for NAV calculation", frequency: "Daily batch 17:00 UTC", protocol: "SFTP", flowTypes: ["nav-calculation"] } },
  { id: "e-settlement-accounting", source: "settlement", target: "fund-accounting", data: { label: "Settled Trades \u2192 Accounting", dataDescription: "Settled trade details for general ledger posting", frequency: "Daily (T+1)", protocol: "Internal Batch", flowTypes: ["nav-calculation"], fieldMappings: [{ sourceSchemaId: "settlement-instruction", sourceFieldIds: ["settle_id", "trade_id", "amount", "currency", "settle_date"], targetSchemaId: "gl-balance" }] } },
  { id: "e-ca-accounting", source: "corporate-actions", target: "fund-accounting", data: { label: "Corp Actions \u2192 Accounting", dataDescription: "Dividend accruals, stock splits, and CA processing results", frequency: "Event-driven", protocol: "Internal", flowTypes: ["nav-calculation"] } },
  { id: "e-accounting-nav", source: "fund-accounting", target: "nav-engine", data: { label: "GL Balances \u2192 NAV", dataDescription: "Fund-level balances and expense accruals for NAV", frequency: "Daily", protocol: "Internal Batch", flowTypes: ["nav-calculation"], fieldMappings: [{ sourceSchemaId: "gl-balance", sourceFieldIds: ["fund_id", "balance", "currency", "as_of_date"], targetSchemaId: "nav-per-share" }, { sourceSchemaId: "expense-accrual", sourceFieldIds: [] }] } },
  { id: "e-nav-client-reporting", source: "nav-engine", target: "client-reporting", data: { label: "NAV \u2192 Client Reports", dataDescription: "NAV per share data for investor reports", frequency: "Daily", protocol: "Internal", flowTypes: ["nav-calculation", "client-reporting"], fieldMappings: [{ sourceSchemaId: "nav-per-share", sourceFieldIds: ["fund_id", "nav_date", "nav_per_share", "currency"] }] } },
  { id: "e-nav-regulatory", source: "nav-engine", target: "regulatory-reporting", data: { label: "NAV \u2192 Regulatory", dataDescription: "Fund valuations for regulatory filings", frequency: "Daily / Periodic", protocol: "Internal", flowTypes: ["nav-calculation", "compliance-monitoring"] } },
  { id: "e-custodian-ca", source: "custodian", target: "corporate-actions", data: { label: "CA Notifications", dataDescription: "Corporate action event notifications from custodian", frequency: "Event-driven", protocol: "SWIFT MT564", flowTypes: ["nav-calculation"] } },

  // Risk Management
  { id: "e-pms-risk", source: "pms", target: "risk-platform", data: { label: "Positions \u2192 Risk", dataDescription: "Portfolio positions and exposures for risk analysis", frequency: "Real-time + EOD", protocol: "REST API", flowTypes: ["risk-management"] } },
  { id: "e-market-data-risk", source: "market-data", target: "risk-platform", data: { label: "Market Data \u2192 Risk", dataDescription: "Real-time market data for VaR and stress testing", frequency: "Real-time", protocol: "Bloomberg B-PIPE", flowTypes: ["risk-management"] } },
  { id: "e-risk-pms", source: "risk-platform", target: "pms", data: { label: "Risk Metrics \u2192 PM", dataDescription: "VaR, tracking error, and limit utilization back to PM", frequency: "Real-time", protocol: "Internal API", flowTypes: ["risk-management"] } },
  { id: "e-counterparty-risk", source: "counterparty-risk", target: "risk-platform", data: { label: "Credit \u2192 Risk", dataDescription: "Counterparty credit exposures and limit data", frequency: "Daily", protocol: "Internal API", flowTypes: ["risk-management"] } },
  { id: "e-risk-regulatory", source: "risk-platform", target: "regulatory-reporting", data: { label: "Risk \u2192 Regulatory", dataDescription: "Risk reports for Form PF and AIFMD filings", frequency: "Periodic", protocol: "Internal Batch", flowTypes: ["risk-management", "compliance-monitoring"] } },

  // Compliance Monitoring
  { id: "e-ems-surveillance", source: "ems", target: "trade-surveillance", data: { label: "Executions \u2192 Surveillance", dataDescription: "Trade execution data for market abuse detection", frequency: "Real-time", protocol: "Internal Feed", flowTypes: ["compliance-monitoring"] } },
  { id: "e-kyc-oms", source: "kyc-aml", target: "oms", data: { label: "KYC Status \u2192 OMS", dataDescription: "Client approval status and trading restrictions", frequency: "Event-driven", protocol: "REST API", flowTypes: ["compliance-monitoring"] } },

  // Reconciliation & Operations
  { id: "e-custodian-recon", source: "custodian", target: "reconciliation", data: { label: "Custodian Positions", dataDescription: "Custodian-held positions for reconciliation", frequency: "Daily (T+1)", protocol: "SFTP", flowTypes: ["nav-calculation"] } },
  { id: "e-accounting-recon", source: "fund-accounting", target: "reconciliation", data: { label: "Internal Positions", dataDescription: "Internal book positions for reconciliation matching", frequency: "Daily (T+1)", protocol: "Internal Batch", flowTypes: ["nav-calculation"] } },
  { id: "e-recon-dw", source: "reconciliation", target: "data-warehouse", data: { label: "Recon Results \u2192 DW", dataDescription: "Reconciliation results and break analysis", frequency: "Daily", protocol: "ETL / Snowflake Connector", flowTypes: ["client-reporting"] } },

  // Client Reporting
  { id: "e-dw-client-reporting", source: "data-warehouse", target: "client-reporting", data: { label: "Analytics \u2192 Reports", dataDescription: "Consolidated analytics data for report generation", frequency: "Daily / Monthly", protocol: "SQL / dbt", flowTypes: ["client-reporting"] } },
  { id: "e-pms-client-reporting", source: "pms", target: "client-reporting", data: { label: "Performance \u2192 Reports", dataDescription: "Performance attribution and portfolio analytics", frequency: "Daily / Monthly", protocol: "REST API", flowTypes: ["client-reporting"] } },
  { id: "e-dw-regulatory", source: "data-warehouse", target: "regulatory-reporting", data: { label: "DW \u2192 Regulatory", dataDescription: "Consolidated data for regulatory report generation", frequency: "Periodic", protocol: "SQL / dbt", flowTypes: ["compliance-monitoring"] } },

  // Cross-system
  { id: "e-market-data-pms", source: "market-data", target: "pms", data: { label: "Market Data \u2192 PM", dataDescription: "Real-time pricing for portfolio valuation", frequency: "Real-time", protocol: "Bloomberg API", flowTypes: ["risk-management", "nav-calculation"] } },
  { id: "e-pms-dw", source: "pms", target: "data-warehouse", data: { label: "Positions \u2192 DW", dataDescription: "Portfolio positions and analytics to data warehouse", frequency: "EOD batch", protocol: "ETL / REST API", flowTypes: ["client-reporting"] } },
  { id: "e-pricing-pms", source: "pricing-service", target: "pms", data: { label: "Prices \u2192 PM", dataDescription: "Evaluated pricing for portfolio analytics", frequency: "Daily", protocol: "SFTP", flowTypes: ["nav-calculation"] } },

  // Bara connections
  { id: "e-accounting-bara", source: "fund-accounting", target: "bara", data: { label: "Accounting \u2192 Bara", dataDescription: "Fund accounting data for portfolio administration", frequency: "Daily", protocol: "REST API", flowTypes: ["nav-calculation"] } },
  { id: "e-bara-nav", source: "bara", target: "nav-engine", data: { label: "Bara \u2192 NAV", dataDescription: "Position and transaction data for NAV calculation", frequency: "Daily", protocol: "Batch", flowTypes: ["nav-calculation"] } },
  { id: "e-bara-client-reporting", source: "bara", target: "client-reporting", data: { label: "Bara \u2192 Reports", dataDescription: "Investor records and fee data for client reporting", frequency: "Monthly", protocol: "REST API", flowTypes: ["client-reporting"] } },
];

// ── Flow Paths ──────────────────────────────────────────────────────────────

const templateFlowPaths: Record<string, string[]> = {
  "trade-lifecycle": [
    "market-data", "oms", "pre-trade-compliance", "oms", "ems",
    "broker-dealer", "ems", "trade-matching", "settlement", "custodian",
  ],
  "nav-calculation": [
    "pricing-service", "nav-engine", "fund-accounting", "nav-engine",
    "corporate-actions", "fund-accounting", "settlement", "fund-accounting",
    "nav-engine", "client-reporting", "regulatory-reporting",
  ],
  "risk-management": [
    "market-data", "risk-platform", "pms", "risk-platform",
    "counterparty-risk", "risk-platform", "regulatory-reporting",
  ],
  "compliance-monitoring": [
    "ems", "trade-surveillance", "kyc-aml", "oms",
    "pre-trade-compliance", "regulatory-reporting",
  ],
  "client-reporting": [
    "pms", "data-warehouse", "client-reporting",
    "reconciliation", "data-warehouse", "regulatory-reporting",
  ],
};

// ── Exported Templates ──────────────────────────────────────────────────────

export const ASSET_MANAGEMENT_TEMPLATE: FlowProject = {
  id: "template-asset-management",
  name: "Asset Management",
  description:
    "Complete asset management data flow with trading, operations, compliance, and reporting",
  nodes: templateNodes,
  edges: templateEdges,
  departments: templateDepartments,
  functions: templateFunctions,
  flowTypes: templateFlowTypes,
  flowPaths: templateFlowPaths,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const BLANK_TEMPLATE: FlowProject = {
  id: "template-blank",
  name: "Blank Project",
  description: "Start from scratch",
  nodes: [],
  edges: [],
  departments: [],
  functions: [],
  flowTypes: [],
  flowPaths: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const templates = [ASSET_MANAGEMENT_TEMPLATE, BLANK_TEMPLATE];
