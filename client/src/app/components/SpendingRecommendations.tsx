'use client'
interface RecommendationProps {
  topCategory: string;
  topAmount: number;
  percentage: number;
}

export default function SpendingRecommendations({ 
  topCategory, 
  topAmount, 
  percentage 
}: RecommendationProps) {
  const tips = [
    `You spend ${percentage}% of your money at ${topCategory}. Consider setting a monthly limit.`,
    `Try meal prepping to reduce frequent ${topCategory.includes('FOOD') ? 'food' : ''} purchases.`,
    `For R${topAmount.toFixed(2)} spent at ${topCategory}, could you find cheaper alternatives?`,
    `Automate savings by transferring what you spend at ${topCategory} to investments.`,
    `Review if all ${topCategory} purchases were necessary or could be reduced.`
  ];

  const generalTips = [
    "💰 50/30/20 Rule: Try spending 50% on needs, 30% on wants, 20% on savings",
    "💡 Use cashback apps for frequent purchase categories",
    "📱 Enable transaction notifications to track spending in real-time",
    "📅 Do a weekly spending review to catch unnecessary expenses early",
    "🎯 Set specific saving goals for motivation to reduce discretionary spending"
  ];

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">
        💡 Spending Insights & Recommendations
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-blue-700">For Your Top Spending Category:</h4>
          <ul className="mt-2 space-y-2 pl-5 list-disc">
            {tips.map((tip, i) => (
              <li key={i} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-blue-200">
          <h4 className="font-medium text-blue-700">General Money Tips:</h4>
          <ul className="mt-2 space-y-2 pl-5 list-disc">
            {generalTips.map((tip, i) => (
              <li key={i} className="text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}