export interface SmartCard {
  cardNumber: string;
  holderName: string;
  balance: number;
  lastRecharge: string;
  status: "Active" | "Inactive" | "Expired";
}

export interface Transaction {
  id: string;
  cardNumber: string;
  amount: number;
  type: "recharge" | "journey" | "refund";
  date: string;
  description: string;
  balanceAfter: number;
}

const CARD_KEY = "jmrc_smart_card";
const TX_KEY = "jmrc_transactions";

function getDefaultCard(): SmartCard {
  return {
    cardNumber: "4532 8890 1234",
    holderName: "Metro Passenger",
    balance: 145,
    lastRecharge: "2026-03-05",
    status: "Active",
  };
}

function getDefaultTransactions(): Transaction[] {
  return [
    { id: "tx-1", cardNumber: "4532 8890 1234", amount: 200, type: "recharge", date: "2026-03-05T10:30:00Z", description: "Online Recharge via UPI", balanceAfter: 345 },
    { id: "tx-2", cardNumber: "4532 8890 1234", amount: -20, type: "journey", date: "2026-03-05T14:00:00Z", description: "Mansarovar → Civil Lines", balanceAfter: 325 },
    { id: "tx-3", cardNumber: "4532 8890 1234", amount: -15, type: "journey", date: "2026-03-06T09:15:00Z", description: "Civil Lines → Chandpole", balanceAfter: 310 },
    { id: "tx-4", cardNumber: "4532 8890 1234", amount: 100, type: "recharge", date: "2026-03-07T11:00:00Z", description: "Counter Recharge", balanceAfter: 410 },
    { id: "tx-5", cardNumber: "4532 8890 1234", amount: -25, type: "journey", date: "2026-03-07T17:30:00Z", description: "Badi Chaupar → Mansarovar", balanceAfter: 385 },
    { id: "tx-6", cardNumber: "4532 8890 1234", amount: -30, type: "journey", date: "2026-03-08T08:00:00Z", description: "Mansarovar → Sitapura (Interchange)", balanceAfter: 355 },
    { id: "tx-7", cardNumber: "4532 8890 1234", amount: -10, type: "journey", date: "2026-03-08T12:45:00Z", description: "Malviya Nagar → Tonk Road", balanceAfter: 345 },
    { id: "tx-8", cardNumber: "4532 8890 1234", amount: -200, type: "journey", date: "2026-03-08T18:00:00Z", description: "Monthly adjustment", balanceAfter: 145 },
  ];
}

export function getSmartCard(): SmartCard {
  const data = localStorage.getItem(CARD_KEY);
  if (!data) {
    const card = getDefaultCard();
    localStorage.setItem(CARD_KEY, JSON.stringify(card));
    return card;
  }
  return JSON.parse(data);
}

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TX_KEY);
  if (!data) {
    const txs = getDefaultTransactions();
    localStorage.setItem(TX_KEY, JSON.stringify(txs));
    return txs;
  }
  return JSON.parse(data);
}

export function rechargeCard(amount: number, method: string): { card: SmartCard; transaction: Transaction } {
  const card = getSmartCard();
  const txs = getTransactions();

  card.balance += amount;
  card.lastRecharge = new Date().toISOString().split("T")[0];

  const tx: Transaction = {
    id: `tx-${Date.now()}`,
    cardNumber: card.cardNumber,
    amount,
    type: "recharge",
    date: new Date().toISOString(),
    description: `Recharge via ${method}`,
    balanceAfter: card.balance,
  };

  txs.unshift(tx);
  localStorage.setItem(CARD_KEY, JSON.stringify(card));
  localStorage.setItem(TX_KEY, JSON.stringify(txs));

  return { card, transaction: tx };
}

export const rechargeAmounts = [50, 100, 200, 500];
export const paymentMethods = ["UPI", "Debit Card", "Credit Card", "Net Banking"];
