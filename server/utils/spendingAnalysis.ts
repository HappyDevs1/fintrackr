interface SpendingAnalysis {
  place: string;
  totalAmount: number;
  transactionCount: number;
}

export function analyzeTopSpending(transactions: any[]): SpendingAnalysis[] {
  // Filter only debit transactions (spending)
  const spendingTransactions = transactions.filter(
    t => t.type === 'DEBIT' && t.transactionType === 'CardPurchases'
  );

  // Extract and clean merchant names from descriptions
  const merchantSpending: Record<string, { amount: number; count: number }> = {};

  spendingTransactions.forEach(transaction => {
    // Extract merchant name (simple pattern - first part of description)
    const merchant = transaction.description.split(' ')[0];
    
    if (!merchantSpending[merchant]) {
      merchantSpending[merchant] = { amount: 0, count: 0 };
    }
    
    merchantSpending[merchant].amount += Math.abs(transaction.amount);
    merchantSpending[merchant].count++;
  });

  // Convert to array and sort by highest spending
  return Object.entries(merchantSpending)
    .map(([place, data]) => ({
      place,
      totalAmount: data.amount,
      transactionCount: data.count
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}