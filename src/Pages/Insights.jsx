import { useEffect, useState } from "react";
import API from "../services/api";

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGenerateInsights = async () => {
      try {
        // Fetch all necessary data from the existing endpoints
        const [dashboardRes, budgetRes, expensesRes] = await Promise.all([
          API.get("/dashboard").catch(() => ({ data: { totalSpent: 0, budgetLeft: 0, topCategory: "None" } })),
          API.get("/budget").catch(() => ({ data: { monthlyBudget: 0 } })),
          API.get("/expenses").catch(() => ({ data: [] }))
        ]);

        const { totalSpent, topCategory } = dashboardRes.data;
        const { monthlyBudget } = budgetRes.data;
        const expenses = expensesRes.data;

        const generatedInsights = [];

        if (expenses.length === 0) {
          generatedInsights.push("💡 You haven't added any expenses yet. Start tracking your spending to see personalized insights!");
        } else {
          // Insight 1: Budget Analysis
          if (monthlyBudget > 0) {
            const percentSpent = ((totalSpent / monthlyBudget) * 100).toFixed(1);
            if (totalSpent > monthlyBudget) {
              generatedInsights.push(`⚠️ **Alert:** You have exceeded your monthly budget by ₹${(totalSpent - monthlyBudget).toFixed(2)}.`);
            } else if (totalSpent === monthlyBudget) {
              generatedInsights.push(`⚠️ You have exactly reached your monthly budget limit of ₹${monthlyBudget}.`);
            } else if (percentSpent > 80) {
              generatedInsights.push(`📈 **Watch out!** You have spent ${percentSpent}% of your ₹${monthlyBudget} budget.`);
            } else {
              generatedInsights.push(`✅ **Great job!** You have only spent ${percentSpent}% of your budget and have ₹${(monthlyBudget - totalSpent).toFixed(2)} left to save.`);
            }
          } else {
             generatedInsights.push("💡 **Tip:** Set a monthly budget on the Budget page to get personalized spending alerts and track your savings.");
          }

          // Insight 2: Category Analysis
          if (topCategory && topCategory !== "None") {
            const categoryExpenses = expenses.filter(e => e.category === topCategory || e.category?.name === topCategory);
            const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
            generatedInsights.push(`📊 Your highest spending category is **${topCategory}** (₹${categoryTotal.toFixed(2)}). Consider reviewing your expenses here to save more.`);
          }

          // Insight 3: Recent Spending Velocity
          const recentDays = 7;
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - recentDays);

          const recentExpenses = expenses.filter(e => new Date(e.date) >= oneWeekAgo);
          if (recentExpenses.length > 0) {
            const recentSpent = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
            generatedInsights.push(`⏳ In the last ${recentDays} days, you made ${recentExpenses.length} transactions totaling ₹${recentSpent.toFixed(2)}.`);
          }

          // Insight 4: Largest Single Expense
          if (expenses.length > 0) {
             const largestExpense = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
             generatedInsights.push(`💸 Your largest single expense so far was **₹${largestExpense.amount.toFixed(2)}** for "${largestExpense.title}".`);
          }
        }

        setInsights(generatedInsights);
      } catch (err) {
        console.error("Error generating insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateInsights();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Spending Insights</h1>
      <p className="text-gray-500 mt-1 mb-8">Personalized financial analysis based on your data.</p>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
             <div key={i} className="bg-gray-100 h-20 rounded-2xl w-full"></div>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {insights.length > 0 ? (
             insights.map((insight, idx) => {
               // Render bold text natively using markdown-like syntax
               const formattedInsight = insight.split("**").map((part, i) =>
                 i % 2 === 1 ? <strong key={i} className="font-bold text-indigo-900">{part}</strong> : part
               );

               return (
                 <li
                   key={idx}
                   className="bg-indigo-50/50 text-indigo-800 p-5 rounded-2xl shadow-sm border border-indigo-100/50 flex items-start gap-3 leading-relaxed text-lg"
                 >
                   <span>{formattedInsight}</span>
                 </li>
               );
             })
          ) : (
             <li className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-gray-500 text-center">
               No insights available at the moment.
             </li>
          )}
        </ul>
      )}
    </div>
  );
}
