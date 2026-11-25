import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Target,
  Repeat,
  Plus,
  Search,
  Filter,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Check,
  X,
  Trash2,
  Edit3,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  Utensils,
  Home,
  Train,
  GraduationCap,
  ShoppingBag,
  Tv,
  AlertTriangle,
  CheckCircle2,
  Info,
  Upload,
  MessageSquareText,
  FileSpreadsheet,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  Menu,
  Eye,
  PiggyBank
} from 'lucide-react';

// ============================================================================
// CONSTANTS & STUDENT CATEGORIES
// ============================================================================
const STORAGE_KEY = 'campusledger_student_finance_v1';

const CATEGORIES = [
  { id: 'Food & Canteen', label: 'Food & Canteen', color: '#f97316', bg: 'rgba(249, 115, 22, 0.14)', icon: 'Utensils' },
  { id: 'Hostel & Rent', label: 'Hostel & Rent', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.14)', icon: 'Home' },
  { id: 'Travel & Commute', label: 'Travel & Commute', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.14)', icon: 'Train' },
  { id: 'College & Books', label: 'College & Books', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.14)', icon: 'GraduationCap' },
  { id: 'Shopping & Entertainment', label: 'Shopping & Entertainment', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.14)', icon: 'ShoppingBag' },
  { id: 'Subscriptions', label: 'Subscriptions', color: '#eab308', bg: 'rgba(234, 179, 8, 0.14)', icon: 'Tv' },
  { id: 'Allowance & Income', label: 'Allowance & Income', color: '#10b981', bg: 'rgba(16, 185, 129, 0.14)', icon: 'Wallet' },
  { id: 'Other', label: 'Other', color: '#71717a', bg: 'rgba(113, 113, 122, 0.14)', icon: 'CreditCard' }
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer'];

const CategoryIcon = ({ name, className = 'w-4 h-4' }) => {
  const map = {
    Utensils: <Utensils className={className} />,
    Home: <Home className={className} />,
    Train: <Train className={className} />,
    GraduationCap: <GraduationCap className={className} />,
    ShoppingBag: <ShoppingBag className={className} />,
    Tv: <Tv className={className} />,
    Wallet: <Wallet className={className} />,
    CreditCard: <CreditCard className={className} />
  };
  return map[name] || <CreditCard className={className} />;
};

const PaymentIcon = ({ method, className = 'w-3.5 h-3.5' }) => {
  switch (method) {
    case 'UPI':
      return <Smartphone className={className} />;
    case 'Cash':
      return <Banknote className={className} />;
    case 'Card':
      return <CreditCard className={className} />;
    case 'Bank Transfer':
      return <Building2 className={className} />;
    default:
      return <Smartphone className={className} />;
  }
};

// ============================================================================
// REALISTIC INITIAL STUDENT DEMO DATA (NOVEMBER 2026)
// ============================================================================
const getInitialState = () => ({
  profile: {
    name: 'Armaan',
    college: 'MITS Gwalior',
    monthlyAllowance: 12000,
    openingBalance: 6450
  },
  theme: 'dark',
  transactions: [
    {
      id: 'tx-101',
      type: 'income',
      amount: 12000,
      category: 'Allowance & Income',
      description: 'Monthly Pocket Money from Parents',
      notes: 'November allowance credited via NEFT',
      method: 'Bank Transfer',
      date: '2026-11-01',
      time: '09:15',
      source: 'recurring'
    },
    {
      id: 'tx-102',
      type: 'expense',
      amount: 4500,
      category: 'Hostel & Rent',
      description: 'Hostel Room & Mess Monthly Fee',
      notes: 'Block B Room 204',
      method: 'Bank Transfer',
      date: '2026-11-03',
      time: '11:30',
      source: 'recurring'
    },
    {
      id: 'tx-103',
      type: 'expense',
      amount: 420,
      category: 'College & Books',
      description: 'Data Structures Spiral Printout & Lab Manual',
      notes: 'Campus Xerox Shop',
      method: 'UPI',
      date: '2026-11-05',
      time: '14:20',
      source: 'manual'
    },
    {
      id: 'tx-104',
      type: 'expense',
      amount: 59,
      category: 'Subscriptions',
      description: 'Spotify Premium Student Plan',
      notes: 'Auto-debit mandate',
      method: 'UPI',
      date: '2026-11-07',
      time: '08:00',
      source: 'recurring'
    },
    {
      id: 'tx-105',
      type: 'expense',
      amount: 240,
      category: 'Food & Canteen',
      description: 'Night Canteen Maggi, Cold Coffee & Roll',
      notes: 'Group study session',
      method: 'UPI',
      date: '2026-11-09',
      time: '23:10',
      source: 'nlp'
    },
    {
      id: 'tx-106',
      type: 'expense',
      amount: 140,
      category: 'Travel & Commute',
      description: 'E-Rickshaw to Railway Station & Back',
      notes: 'Shared auto',
      method: 'Cash',
      date: '2026-11-12',
      time: '16:45',
      source: 'manual'
    },
    {
      id: 'tx-107',
      type: 'income',
      amount: 1500,
      category: 'Allowance & Income',
      description: 'Hackathon UI Design Freelance Payout',
      notes: 'Split with teammate',
      method: 'UPI',
      date: '2026-11-14',
      time: '18:05',
      source: 'manual'
    },
    {
      id: 'tx-108',
      type: 'expense',
      amount: 680,
      category: 'Shopping & Entertainment',
      description: 'IMAX Movie Ticket & Popcorn Combo',
      notes: 'Weekend outing at DD Mall',
      method: 'Card',
      date: '2026-11-16',
      time: '19:30',
      source: 'manual'
    },
    {
      id: 'tx-109',
      type: 'expense',
      amount: 299,
      category: 'Subscriptions',
      description: 'Jio 5G Student Unlimited Recharge',
      notes: '28 days validity',
      method: 'UPI',
      date: '2026-11-18',
      time: '10:12',
      source: 'recurring'
    },
    {
      id: 'tx-110',
      type: 'expense',
      amount: 340,
      category: 'Food & Canteen',
      description: 'Zomato Biryani Order with Roommate',
      notes: 'Post-midsem treat',
      method: 'UPI',
      date: '2026-11-20',
      time: '21:15',
      source: 'sms'
    },
    {
      id: 'tx-111',
      type: 'expense',
      amount: 185,
      category: 'Food & Canteen',
      description: 'Lunch Thali & Chaas at Main Canteen',
      notes: '',
      method: 'UPI',
      date: '2026-11-22',
      time: '13:25',
      source: 'nlp'
    },
    {
      id: 'tx-112',
      type: 'expense',
      amount: 95,
      category: 'Travel & Commute',
      description: 'Rapido Bike Ride to City Library',
      notes: '',
      method: 'UPI',
      date: '2026-11-23',
      time: '15:10',
      source: 'nlp'
    },
    {
      id: 'tx-113',
      type: 'expense',
      amount: 260,
      category: 'Food & Canteen',
      description: 'Evening Samosa, Chai & Fruit Bowl',
      notes: 'Nescafe kiosk',
      method: 'UPI',
      date: '2026-11-24',
      time: '17:40',
      source: 'nlp'
    },
    {
      id: 'tx-114',
      type: 'expense',
      amount: 120,
      category: 'Food & Canteen',
      description: 'Paneer Paratha & Curd Lunch',
      notes: 'Canteen counter 2',
      method: 'UPI',
      date: '2026-11-25',
      time: '13:05',
      source: 'nlp'
    }
  ],
  previousMonthTotals: {
    'Food & Canteen': 1420,
    'Hostel & Rent': 4500,
    'Travel & Commute': 580,
    'College & Books': 650,
    'Shopping & Entertainment': 850,
    'Subscriptions': 358,
    'Other': 200
  },
  budgets: {
    'Food & Canteen': 1500,
    'Hostel & Rent': 4500,
    'Travel & Commute': 600,
    'College & Books': 800,
    'Shopping & Entertainment': 900,
    'Subscriptions': 500,
    'Other': 400
  },
  savingsGoals: [
    {
      id: 'goal-1',
      title: 'Sony WH-1000XM5 Headphones',
      category: 'Tech & Study',
      targetAmount: 18000,
      savedAmount: 11500,
      targetDate: '2027-02-15',
      color: '#3b82f6'
    },
    {
      id: 'goal-2',
      title: 'Student Emergency Cushion',
      category: 'Safety Net',
      targetAmount: 10000,
      savedAmount: 7800,
      targetDate: '2027-01-31',
      color: '#10b981'
    },
    {
      id: 'goal-3',
      title: 'Manali Post-Exam Group Trip',
      category: 'Travel',
      targetAmount: 8500,
      savedAmount: 3400,
      targetDate: '2027-03-20',
      color: '#f97316'
    }
  ],
  recurring: [
    {
      id: 'rec-1',
      title: 'Hostel Room & Mess Fee',
      type: 'expense',
      amount: 4500,
      category: 'Hostel & Rent',
      method: 'Bank Transfer',
      frequency: 'Monthly',
      nextDate: '2026-12-03',
      autoLog: false
    },
    {
      id: 'rec-2',
      title: 'Monthly Allowance from Parents',
      type: 'income',
      amount: 12000,
      category: 'Allowance & Income',
      method: 'Bank Transfer',
      frequency: 'Monthly',
      nextDate: '2026-12-01',
      autoLog: true
    },
    {
      id: 'rec-3',
      title: 'Spotify Student Plan',
      type: 'expense',
      amount: 59,
      category: 'Subscriptions',
      method: 'UPI',
      frequency: 'Monthly',
      nextDate: '2026-12-07',
      autoLog: true
    },
    {
      id: 'rec-4',
      title: 'Jio 5G Student Pack',
      type: 'expense',
      amount: 299,
      category: 'Subscriptions',
      method: 'UPI',
      frequency: 'Every 28 Days',
      nextDate: '2026-11-28',
      autoLog: false
    },
    {
      id: 'rec-5',
      title: 'GitHub / Cloud Domain Renewal',
      type: 'expense',
      amount: 199,
      category: 'College & Books',
      method: 'Card',
      frequency: 'Monthly',
      nextDate: '2026-11-29',
      autoLog: false
    }
  ],
  notificationSettings: {
    budgetWarnings: true,
    recurringReminders: true,
    savingsMilestones: true,
    spendingTrends: true
  },
  dismissedNotificationIds: []
});

// ============================================================================
// NLP & BANK SMS PARSING ENGINE
// ============================================================================
function parseSmartTransaction(rawText) {
  const text = (rawText || '').trim();
  if (!text) {
    return {
      amount: 0,
      type: 'expense',
      category: 'Food & Canteen',
      method: 'UPI',
      description: '',
      date: '2026-11-25',
      time: '12:00',
      confidence: 0
    };
  }

  const lower = text.toLowerCase();

  // 1. Extract Amount (supports ₹120, Rs. 240.00, INR 1,500, 120rs, or standalone numbers)
  let amount = 0;
  const currencyMatch = text.match(/(?:₹|rs\.?|inr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i) ||
    text.match(/([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:₹|rs\.?|inr|rupees)/i);
  if (currencyMatch) {
    amount = parseFloat(currencyMatch[1].replace(/,/g, ''));
  } else {
    const numMatch = text.match(/\b([0-9]{1,6}(?:\.[0-9]{1,2})?)\b/);
    if (numMatch) amount = parseFloat(numMatch[1]);
  }

  // 2. Detect Income vs Expense
  const incomeKeywords = ['received', 'credited', 'allowance', 'pocket money', 'refund', 'cashback', 'stipend', 'freelance', 'won', 'salary', 'deposited', 'got from'];
  const isIncome = incomeKeywords.some((kw) => lower.includes(kw));
  const type = isIncome ? 'income' : 'expense';

  // 3. Detect Payment Method
  let method = 'UPI';
  if (/\bcash\b/.test(lower)) method = 'Cash';
  else if (/\b(card|debit card|credit card|visa|mastercard|rupay|swipe)\b/.test(lower)) method = 'Card';
  else if (/\b(bank|neft|imps|rtgs|transfer|netbanking|a\/c)\b/.test(lower)) method = 'Bank Transfer';
  else if (/\b(upi|gpay|phonepe|paytm|bhim|cred|scan|qr)\b/.test(lower)) method = 'UPI';

  // 4. Detect Category
  let category = isIncome ? 'Allowance & Income' : 'Other';
  if (!isIncome) {
    if (/\b(lunch|dinner|breakfast|chai|tea|coffee|canteen|mess|zomato|swiggy|food|burger|pizza|biryani|maggi|samosa|snack|restaurant|cafe|roll|paratha)\b/.test(lower)) {
      category = 'Food & Canteen';
    } else if (/\b(hostel|rent|room|pg|electricity|wifi|water|laundry|maintenance)\b/.test(lower)) {
      category = 'Hostel & Rent';
    } else if (/\b(auto|rickshaw|cab|uber|ola|rapido|metro|bus|train|ticket|fuel|petrol|travel|commute)\b/.test(lower)) {
      category = 'Travel & Commute';
    } else if (/\b(book|xerox|print|stationery|notebook|pen|exam|fee|course|udemy|college|lab|tuition|library)\b/.test(lower)) {
      category = 'College & Books';
    } else if (/\b(movie|cinema|game|steam|shopping|clothes|tshirt|shoes|amazon|flipkart|myntra|concert|outing|mall)\b/.test(lower)) {
      category = 'Shopping & Entertainment';
    } else if (/\b(spotify|netflix|prime|youtube|subscription|recharge|jio|airtel|vi|icloud|membership)\b/.test(lower)) {
      category = 'Subscriptions';
    }
  }

  // 5. Extract Date if present (DD-MM-YY or YYYY-MM-DD or "yesterday")
  let date = '2026-11-25';
  if (lower.includes('yesterday')) {
    date = '2026-11-24';
  } else {
    const dmy = text.match(/\b(\d{2})[-/](\d{2})[-/](\d{2,4})\b/);
    if (dmy) {
      const year = dmy[3].length === 2 ? `20${dmy[3]}` : dmy[3];
      date = `${year}-${dmy[2]}-${dmy[1]}`;
    }
  }

  // 6. Clean Description
  let cleaned = text
    .replace(/(?:debited|credited)\s+(?:rs\.?|inr|₹)?\s*[0-9,.]+\s*(?:from|to)\s*a\/c\s*[x0-9]+/gi, '')
    .replace(/(?:spent|paid|received|got|sent|bought)\s*/gi, '')
    .replace(/(?:₹|rs\.?|inr)\s*[0-9,]+(?:\.[0-9]{1,2})?/gi, '')
    .replace(/[0-9,]+(?:\.[0-9]{1,2})?\s*(?:₹|rs\.?|inr|rupees)/gi, '')
    .replace(/\b(?:using|via|through|by|with)\s+(?:upi|gpay|phonepe|paytm|cash|card|bank transfer|neft|imps)\b/gi, '')
    .replace(/\b(?:on|for|at|to|from)\b/gi, ' ')
    .replace(/\b\d{2}[-/]\d{2}[-/]\d{2,4}\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned.length < 2) {
    cleaned = category === 'Allowance & Income' ? 'Allowance / Credit' : `${category} Expense`;
  } else {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    amount: isNaN(amount) ? 0 : amount,
    type,
    category,
    method,
    description: cleaned,
    date,
    time,
    confidence: amount > 0 ? 94 : 60
  };
}

// Format Indian Rupee cleanly with tabular numbers
const formatINR = (num) => {
  const val = Number(num) || 0;
  return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [appState, setAppState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load state', e);
    }
    return getInitialState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, [appState]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [smartModalOpen, setSmartModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [inspectingTx, setInspectingTx] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const isDark = appState.theme === 'dark';

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2900 ? null : prev));
    }, 3000);
  };

  // Keyboard shortcuts: '/' or 'n' opens Smart Add Modal when not typing in input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === '/' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingTx(null);
        setSmartModalOpen(true);
      } else if (e.key === 'Escape') {
        setSmartModalOpen(false);
        setInspectingTx(null);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ==========================================================================
  // DERIVED FINANCIAL METRICS & ANALYTICS
  // ==========================================================================
  const metrics = useMemo(() => {
    const txs = appState.transactions;
    const novTxs = txs.filter((t) => t.date.startsWith('2026-11'));

    const totalIncomeMonth = novTxs
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalSpentMonth = novTxs
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalAllTimeIncome = txs
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalAllTimeExpense = txs
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalAllocatedToGoals = appState.savingsGoals.reduce(
      (acc, g) => acc + Number(g.savedAmount),
      0
    );

    const totalBalance =
      Number(appState.profile.openingBalance) + totalAllTimeIncome - totalAllTimeExpense;

    const monthlyAllowance = Number(appState.profile.monthlyAllowance) || 12000;
    const remainingBudget = monthlyAllowance - totalSpentMonth;

    // Days left in November (Current simulated date: Nov 25, 2026 -> 6 days left incl today)
    const daysElapsed = 25;
    const daysRemaining = 6;
    const dailySafeSpend = remainingBudget > 0 ? Math.floor(remainingBudget / daysRemaining) : 0;
    const avgDailySpend = Math.round(totalSpentMonth / daysElapsed);

    // Category spend breakdown (November expenses)
    const categorySpend = {};
    CATEGORIES.forEach((c) => {
      if (c.id !== 'Allowance & Income') categorySpend[c.id] = 0;
    });
    novTxs
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categorySpend[t.category] = (categorySpend[t.category] || 0) + Number(t.amount);
      });

    const sortedCategories = Object.entries(categorySpend)
      .map(([cat, amount]) => {
        const meta = CATEGORIES.find((c) => c.id === cat) || CATEGORIES[7];
        const limit = appState.budgets[cat] || 1000;
        const pct = limit > 0 ? Math.round((amount / limit) * 100) : 0;
        return { category: cat, amount, limit, pct, color: meta.color, bg: meta.bg, icon: meta.icon };
      })
      .sort((a, b) => b.amount - a.amount);

    // Daily trend for Nov 1 - Nov 25
    const dailyMap = {};
    for (let d = 1; d <= 25; d++) {
      const ds = `2026-11-${String(d).padStart(2, '0')}`;
      dailyMap[ds] = 0;
    }
    novTxs
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (dailyMap[t.date] !== undefined) {
          dailyMap[t.date] += Number(t.amount);
        }
      });

    const dailySeries = Object.entries(dailyMap).map(([date, amount]) => ({
      date,
      day: parseInt(date.split('-')[2], 10),
      amount
    }));

    // Last 7 days vs previous 7 days
    const last7Total = dailySeries.slice(-7).reduce((a, b) => a + b.amount, 0);
    const prev7Total = dailySeries.slice(-14, -7).reduce((a, b) => a + b.amount, 0);

    return {
      totalBalance,
      totalIncomeMonth,
      totalSpentMonth,
      monthlyAllowance,
      remainingBudget,
      dailySafeSpend,
      avgDailySpend,
      categorySpend,
      sortedCategories,
      dailySeries,
      last7Total,
      prev7Total,
      totalAllocatedToGoals
    };
  }, [appState]);

  // ==========================================================================
  // DATA-DRIVEN SMART INSIGHTS ENGINE
  // ==========================================================================
  const smartInsights = useMemo(() => {
    const insights = [];
    const txs = appState.transactions.filter((t) => t.type === 'expense');

    // 1. Weekly Food comparison (Nov 19-25 vs Nov 12-18)
    const thisWeekFood = txs
      .filter((t) => t.category === 'Food & Canteen' && t.date >= '2026-11-19')
      .reduce((s, t) => s + t.amount, 0);
    const lastWeekFood = txs
      .filter((t) => t.category === 'Food & Canteen' && t.date >= '2026-11-12' && t.date <= '2026-11-18')
      .reduce((s, t) => s + t.amount, 0);

    if (thisWeekFood > lastWeekFood) {
      const diff = thisWeekFood - lastWeekFood;
      insights.push({
        id: 'ins-food',
        type: 'warning',
        title: 'Food & canteen spending climbed this week',
        detail: `You spent ${formatINR(thisWeekFood)} on food in the last 7 days (${formatINR(diff)} more than the prior week). Cooking or using the mess pass for 2 meals can save ~₹350.`
      });
    } else {
      insights.push({
        id: 'ins-food-good',
        type: 'positive',
        title: 'Great control on canteen & food orders',
        detail: `Your weekly food spend (${formatINR(thisWeekFood)}) is lower than last week (${formatINR(lastWeekFood)}).`
      });
    }

    // 2. Month-over-month Travel comparison
    const currTravel = metrics.categorySpend['Travel & Commute'] || 0;
    const prevTravel = appState.previousMonthTotals['Travel & Commute'] || 580;
    if (currTravel < prevTravel) {
      const saved = prevTravel - currTravel;
      insights.push({
        id: 'ins-travel',
        type: 'positive',
        title: 'You spent less on transportation vs last month',
        detail: `Commute expenses are ${formatINR(currTravel)} so far compared to ${formatINR(prevTravel)} in October—saving you ${formatINR(saved)}.`
      });
    }

    // 3. Approaching / Exceeded Category Budgets
    metrics.sortedCategories.forEach((cat) => {
      if (cat.category === 'Hostel & Rent') return; // Fixed fee
      if (cat.pct >= 100) {
        insights.push({
          id: `ins-over-${cat.category}`,
          type: 'alert',
          title: `${cat.category} budget exceeded (${cat.pct}%)`,
          detail: `You've spent ${formatINR(cat.amount)} against your ${formatINR(cat.limit)} limit. Consider pausing non-essential spends here until Dec 1.`
        });
      } else if (cat.pct >= 75) {
        insights.push({
          id: `ins-warn-${cat.category}`,
          type: 'warning',
          title: `Approaching your ${cat.category} limit (${cat.pct}%)`,
          detail: `Only ${formatINR(cat.limit - cat.amount)} remaining out of ${formatINR(cat.limit)} for the rest of November.`
        });
      }
    });

    // 4. Burn-rate projection
    const projectedTotal = metrics.avgDailySpend * 30;
    if (projectedTotal > metrics.monthlyAllowance) {
      insights.push({
        id: 'ins-burn',
        type: 'warning',
        title: 'Watch your end-of-month pace',
        detail: `At ${formatINR(metrics.avgDailySpend)}/day, your 30-day projection is ${formatINR(projectedTotal)}. Keep daily spends under ${formatINR(metrics.dailySafeSpend)}/day to stay within allowance.`
      });
    } else {
      insights.push({
        id: 'ins-burn-good',
        type: 'positive',
        title: 'On track for a surplus this month',
        detail: `Your daily average of ${formatINR(metrics.avgDailySpend)}/day leaves a comfortable ${formatINR(metrics.dailySafeSpend)}/day safe-to-spend buffer for the final 6 days.`
      });
    }

    return insights;
  }, [appState, metrics]);

  // ==========================================================================
  // LIVE NOTIFICATION CENTER ITEMS
  // ==========================================================================
  const notifications = useMemo(() => {
    const list = [];
    const settings = appState.notificationSettings;

    if (settings.budgetWarnings) {
      metrics.sortedCategories.forEach((c) => {
        if (c.category !== 'Hostel & Rent' && c.pct >= 75) {
          list.push({
            id: `notif-budget-${c.category}`,
            category: 'Budget Warning',
            title: `${c.category} at ${c.pct}% of budget`,
            body: `${formatINR(c.amount)} spent of ${formatINR(c.limit)} monthly limit.`,
            tone: c.pct >= 100 ? 'rose' : 'amber',
            time: 'Today'
          });
        }
      });
    }

    if (settings.recurringReminders) {
      appState.recurring.forEach((r) => {
        if (r.nextDate >= '2026-11-25' && r.nextDate <= '2026-12-03') {
          list.push({
            id: `notif-rec-${r.id}`,
            category: 'Upcoming Bill',
            title: `${r.title} (${formatINR(r.amount)})`,
            body: `Scheduled on ${r.nextDate} via ${r.method}.`,
            tone: 'blue',
            time: r.nextDate
          });
        }
      });
    }

    if (settings.savingsMilestones) {
      appState.savingsGoals.forEach((g) => {
        const pct = Math.round((g.savedAmount / g.targetAmount) * 100);
        if (pct >= 60) {
          list.push({
            id: `notif-goal-${g.id}`,
            category: 'Savings Milestone',
            title: `${pct}% reached for ${g.title}`,
            body: `${formatINR(g.savedAmount)} saved toward your ${formatINR(g.targetAmount)} goal.`,
            tone: 'emerald',
            time: 'Milestone'
          });
        }
      });
    }

    return list.filter((n) => !appState.dismissedNotificationIds.includes(n.id));
  }, [appState, metrics]);

  // ==========================================================================
  // CRUD HANDLERS
  // ==========================================================================
  const handleSaveTransaction = (txData) => {
    setAppState((prev) => {
      if (txData.id && prev.transactions.some((t) => t.id === txData.id)) {
        return {
          ...prev,
          transactions: prev.transactions.map((t) => (t.id === txData.id ? txData : t))
        };
      }
      const newTx = {
        ...txData,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)
      };
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions]
      };
    });
    showToast(txData.id ? 'Transaction updated' : 'Transaction logged');
    setSmartModalOpen(false);
    setEditingTx(null);
  };

  const handleBatchImport = (newTransactions) => {
    setAppState((prev) => ({
      ...prev,
      transactions: [...newTransactions, ...prev.transactions]
    }));
    showToast(`Imported ${newTransactions.length} verified transactions`);
  };

  const handleDeleteTransaction = (id) => {
    setAppState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id)
    }));
    setInspectingTx(null);
    showToast('Transaction deleted', 'neutral');
  };

  const handleUpdateAllowanceAndBudgets = (newAllowance, newBudgets) => {
    setAppState((prev) => ({
      ...prev,
      profile: { ...prev.profile, monthlyAllowance: Number(newAllowance) },
      budgets: newBudgets
    }));
    showToast('Monthly allowance & category budgets saved');
  };

  const handleAddFundsToGoal = (goalId, amountToAdd) => {
    const addVal = Number(amountToAdd);
    if (!addVal || addVal <= 0) return;
    setAppState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === goalId ? { ...g, savedAmount: g.savedAmount + addVal } : g
      )
    }));
    showToast(`Added ${formatINR(addVal)} to savings goal`);
  };

  const handleCreateGoal = (goal) => {
    setAppState((prev) => ({
      ...prev,
      savingsGoals: [
        ...prev.savingsGoals,
        { ...goal, id: 'goal-' + Date.now(), savedAmount: Number(goal.savedAmount) || 0 }
      ]
    }));
    showToast('New savings goal created');
  };

  const handleDeleteGoal = (goalId) => {
    setAppState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== goalId)
    }));
    showToast('Goal removed', 'neutral');
  };

  const handleLogRecurringNow = (rec) => {
    const newTx = {
      id: 'tx-' + Date.now(),
      type: rec.type,
      amount: rec.amount,
      category: rec.category,
      description: rec.title,
      notes: `Logged from recurring (${rec.frequency})`,
      method: rec.method,
      date: '2026-11-25',
      time: '12:00',
      source: 'recurring'
    };
    setAppState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
    showToast(`Logged "${rec.title}" (${formatINR(rec.amount)})`);
  };

  const handleCreateRecurring = (rec) => {
    setAppState((prev) => ({
      ...prev,
      recurring: [...prev.recurring, { ...rec, id: 'rec-' + Date.now() }]
    }));
    showToast('Recurring schedule added');
  };

  const handleDeleteRecurring = (id) => {
    setAppState((prev) => ({
      ...prev,
      recurring: prev.recurring.filter((r) => r.id !== id)
    }));
    showToast('Recurring item removed', 'neutral');
  };

  const handleResetDemo = () => {
    const fresh = getInitialState();
    fresh.theme = appState.theme;
    setAppState(fresh);
    showToast('Demo student workspace restored');
  };

  // ==========================================================================
  // THEME TOKENS (LINEAR / APPLE WALLET INSPIRED)
  // ==========================================================================
  const ui = {
    bg: isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#f8fafc] text-zinc-900',
    sidebar: isDark ? 'bg-[#0c0c0f] border-zinc-800/80' : 'bg-white border-zinc-200',
    card: isDark
      ? 'bg-[#121215] border border-zinc-800/90 shadow-sm'
      : 'bg-white border border-zinc-200/90 shadow-sm',
    cardSubtle: isDark
      ? 'bg-zinc-900/70 border border-zinc-800/70'
      : 'bg-zinc-50 border border-zinc-200/80',
    muted: isDark ? 'text-zinc-400' : 'text-zinc-500',
    subtleText: isDark ? 'text-zinc-500' : 'text-zinc-400',
    input: isDark
      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500'
      : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-indigo-600',
    hoverRow: isDark ? 'hover:bg-zinc-900/80' : 'hover:bg-zinc-50'
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budgets & Allowance', icon: Wallet },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'recurring', label: 'Recurring & Bills', icon: Repeat }
  ];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-200 font-sans antialiased ${ui.bg}`}>
      {/* ====================================================================
          DESKTOP LEFT SIDEBAR
      ==================================================================== */}
      <aside className={`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r z-30 ${ui.sidebar}`}>
        {/* Brand Header */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
              ₹
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight leading-none">CampusLedger</div>
              <div className={`text-[11px] mt-1 ${ui.muted}`}>Smart Student Finance</div>
            </div>
          </div>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            PRO
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? isDark
                      ? 'bg-zinc-800/90 text-white shadow-xs'
                      : 'bg-zinc-900 text-white shadow-xs'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                {item.id === 'transactions' && (
                  <span className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded ${active ? 'bg-white/15 text-white' : ui.cardSubtle}`}>
                    {appState.transactions.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Allowance Mini Card in Sidebar */}
        <div className="p-3 m-3 rounded-xl border border-inherit bg-indigo-500/5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className={ui.muted}>Nov Allowance Left</span>
            <span className="font-semibold tabular-nums text-emerald-400">
              {formatINR(Math.max(0, metrics.remainingBudget))}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-800/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((metrics.totalSpentMonth / metrics.monthlyAllowance) * 100))}%`
              }}
            />
          </div>
          <div className={`text-[11px] mt-2 flex items-center justify-between ${ui.muted}`}>
            <span>Safe daily limit</span>
            <span className="font-medium tabular-nums">{formatINR(metrics.dailySafeSpend)}/day</span>
          </div>
        </div>

        {/* Footer Reset Demo Action */}
        <div className="px-4 py-3 border-t border-inherit flex items-center justify-between">
          <div className="text-xs">
            <div className="font-medium">{appState.profile.name}</div>
            <div className={`text-[11px] ${ui.muted}`}>{appState.profile.college}</div>
          </div>
          <button
            onClick={handleResetDemo}
            title="Reset demo student data"
            className={`p-2 rounded-lg text-xs transition ${ui.hoverRow} ${ui.muted}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ====================================================================
          MOBILE DRAWER NAVIGATION
      ==================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`relative w-72 max-w-[80vw] h-full flex flex-col border-r z-10 ${ui.sidebar}`}>
            <div className="px-5 h-16 flex items-center justify-between border-b border-inherit">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  ₹
                </div>
                <span className="font-semibold text-sm">CampusLedger</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : isDark
                        ? 'text-zinc-300 hover:bg-zinc-900'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-inherit">
              <button
                onClick={() => {
                  handleResetDemo();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-inherit text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN CONTENT SHELL
      ==================================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header
          className={`sticky top-0 z-20 h-16 px-4 sm:px-6 border-b backdrop-blur-md flex items-center justify-between gap-3 ${
            isDark
              ? 'bg-[#09090b]/85 border-zinc-800/80'
              : 'bg-[#f8fafc]/85 border-zinc-200/80'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg border ${ui.card}`}
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="truncate">
              <h1 className="text-sm sm:text-base font-semibold tracking-tight truncate">
                Good evening, {appState.profile.name} 👋
              </h1>
              <p className={`text-xs hidden sm:block ${ui.muted}`}>
                Wed, 25 Nov 2026 • Safe daily spend: <span className="font-medium text-emerald-400 tabular-nums">{formatINR(metrics.dailySafeSpend)}/day</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Smart Add Trigger */}
            <button
              onClick={() => {
                setEditingTx(null);
                setSmartModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Smart Add</span>
              <kbd className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded bg-indigo-700/80 text-indigo-100 border border-indigo-400/30">
                /
              </kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className={`p-2 rounded-lg border transition relative ${ui.card} ${ui.hoverRow}`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <NotificationPopover
                  isDark={isDark}
                  ui={ui}
                  notifications={notifications}
                  settings={appState.notificationSettings}
                  onToggleSetting={(key) =>
                    setAppState((prev) => ({
                      ...prev,
                      notificationSettings: {
                        ...prev.notificationSettings,
                        [key]: !prev.notificationSettings[key]
                      }
                    }))
                  }
                  onMarkAllRead={() =>
                    setAppState((prev) => ({
                      ...prev,
                      dismissedNotificationIds: [
                        ...prev.dismissedNotificationIds,
                        ...notifications.map((n) => n.id)
                      ]
                    }))
                  }
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() =>
                setAppState((prev) => ({
                  ...prev,
                  theme: prev.theme === 'dark' ? 'light' : 'dark'
                }))
              }
              className={`p-2 rounded-lg border transition ${ui.card} ${ui.hoverRow}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>
        </header>

        {/* Active View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
          {activeTab === 'dashboard' && (
            <DashboardView
              ui={ui}
              isDark={isDark}
              appState={appState}
              metrics={metrics}
              insights={smartInsights}
              onNavigate={setActiveTab}
              onOpenSmartAdd={() => {
                setEditingTx(null);
                setSmartModalOpen(true);
              }}
              onInspectTx={setInspectingTx}
              onAddGoalFunds={handleAddFundsToGoal}
              onLogRecurring={handleLogRecurringNow}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              ui={ui}
              isDark={isDark}
              transactions={appState.transactions}
              onOpenSmartAdd={() => {
                setEditingTx(null);
                setSmartModalOpen(true);
              }}
              onEditTx={(tx) => {
                setEditingTx(tx);
                setSmartModalOpen(true);
              }}
              onDeleteTx={handleDeleteTransaction}
              onInspectTx={setInspectingTx}
              onBatchImport={handleBatchImport}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsView
              ui={ui}
              isDark={isDark}
              appState={appState}
              metrics={metrics}
              onSaveBudgets={handleUpdateAllowanceAndBudgets}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              ui={ui}
              isDark={isDark}
              appState={appState}
              metrics={metrics}
              insights={smartInsights}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsGoalsView
              ui={ui}
              isDark={isDark}
              goals={appState.savingsGoals}
              totalBalance={metrics.totalBalance}
              onAddFunds={handleAddFundsToGoal}
              onCreateGoal={handleCreateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'recurring' && (
            <RecurringView
              ui={ui}
              isDark={isDark}
              recurring={appState.recurring}
              onLogNow={handleLogRecurringNow}
              onCreateRecurring={handleCreateRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          )}
        </main>

        {/* Mobile Bottom Quick Nav */}
        <nav
          className={`lg:hidden fixed bottom-0 inset-x-0 border-t px-2 py-1.5 flex items-center justify-around z-20 ${
            isDark ? 'bg-[#0c0c0f]/95 border-zinc-800' : 'bg-white/95 border-zinc-200'
          } backdrop-blur-md`}
        >
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium ${
                  active ? 'text-indigo-500' : ui.muted
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ====================================================================
          SMART NLP ADD / EDIT TRANSACTION MODAL
      ==================================================================== */}
      {smartModalOpen && (
        <SmartTransactionModal
          isDark={isDark}
          ui={ui}
          initialTx={editingTx}
          onClose={() => {
            setSmartModalOpen(false);
            setEditingTx(null);
          }}
          onSave={handleSaveTransaction}
        />
      )}

      {/* ====================================================================
          TRANSACTION DETAIL MODAL
      ==================================================================== */}
      {inspectingTx && (
        <TransactionDetailModal
          isDark={isDark}
          ui={ui}
          tx={inspectingTx}
          onClose={() => setInspectingTx(null)}
          onEdit={(tx) => {
            setInspectingTx(null);
            setEditingTx(tx);
            setSmartModalOpen(true);
          }}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* ====================================================================
          FLOATING TOAST FEEDBACK
      ==================================================================== */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-700 shadow-lg text-xs sm:text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 1. DASHBOARD VIEW
// ============================================================================
function DashboardView({
  ui,
  isDark,
  appState,
  metrics,
  insights,
  onNavigate,
  onOpenSmartAdd,
  onInspectTx,
  onAddGoalFunds,
  onLogRecurring
}) {
  const [quickInput, setQuickInput] = useState('');
  const parsedQuick = useMemo(() => parseSmartTransaction(quickInput), [quickInput]);

  const budgetUsedPct = Math.min(
    100,
    Math.round((metrics.totalSpentMonth / metrics.monthlyAllowance) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Instant Natural Language Quick Bar */}
      <div className={`p-3.5 sm:p-4 rounded-xl ${ui.card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Quick NLP Entry</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder='Try: "Spent ₹120 on lunch using UPI" or "₹60 auto rickshaw cash"'
              className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition ${ui.input}`}
            />
            <button
              onClick={onOpenSmartAdd}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shrink-0 transition"
            >
              Review & Log
            </button>
          </div>
        </div>
        {quickInput.trim().length > 2 && (
          <div className="mt-3 pt-3 border-t border-inherit flex flex-wrap items-center gap-2 text-xs">
            <span className={ui.muted}>Detected:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-medium ${
                parsedQuick.type === 'income'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-rose-500/15 text-rose-400'
              }`}
            >
              {parsedQuick.type === 'income' ? '+' : '-'}
              {formatINR(parsedQuick.amount)}
            </span>
            <span className={`px-2 py-0.5 rounded-md ${ui.cardSubtle}`}>{parsedQuick.category}</span>
            <span className={`px-2 py-0.5 rounded-md ${ui.cardSubtle}`}>{parsedQuick.method}</span>
            <span className={`px-2 py-0.5 rounded-md ${ui.cardSubtle}`}>{parsedQuick.description}</span>
          </div>
        )}
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className={`p-5 rounded-xl ${ui.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${ui.muted}`}>Total Wallet Balance</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
            {formatINR(metrics.totalBalance)}
          </div>
          <div className={`mt-2 text-xs flex items-center gap-1.5 ${ui.muted}`}>
            <span className="text-emerald-400 font-medium">+{formatINR(metrics.totalIncomeMonth)}</span>
            <span>credited this month</span>
          </div>
        </div>

        {/* Money Received This Month */}
        <div className={`p-5 rounded-xl ${ui.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${ui.muted}`}>Allowance & Income (Nov)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums text-emerald-400">
            {formatINR(metrics.totalIncomeMonth)}
          </div>
          <div className={`mt-2 text-xs ${ui.muted}`}>
            Base allowance: {formatINR(metrics.monthlyAllowance)} + ₹1,500 freelance
          </div>
        </div>

        {/* Total Spent This Month */}
        <div className={`p-5 rounded-xl ${ui.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${ui.muted}`}>Spent This Month</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums">
            {formatINR(metrics.totalSpentMonth)}
          </div>
          <div className={`mt-2 text-xs flex items-center justify-between ${ui.muted}`}>
            <span>Avg {formatINR(metrics.avgDailySpend)}/day</span>
            <span>{budgetUsedPct}% of allowance</span>
          </div>
        </div>

        {/* Remaining Monthly Budget */}
        <div className={`p-5 rounded-xl ${ui.card}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${ui.muted}`}>Remaining Allowance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`mt-3 text-2xl font-bold tracking-tight tabular-nums ${
              metrics.remainingBudget < 1000 ? 'text-amber-400' : ''
            }`}
          >
            {formatINR(Math.max(0, metrics.remainingBudget))}
          </div>
          <div className="mt-2.5 w-full h-1.5 rounded-full bg-zinc-800/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                budgetUsedPct >= 90 ? 'bg-rose-500' : budgetUsedPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Charts Row: Daily Spending Trend + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Spending Trend Chart */}
        <div className={`p-5 rounded-xl lg:col-span-2 flex flex-col justify-between ${ui.card}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold">November Daily Spending Trend</h2>
              <p className={`text-xs ${ui.muted}`}>
                Last 7 days: <span className="font-medium tabular-nums">{formatINR(metrics.last7Total)}</span> vs prior 7 days:{' '}
                <span className="font-medium tabular-nums">{formatINR(metrics.prev7Total)}</span>
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Deep Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <DailyBarChart series={metrics.dailySeries} isDark={isDark} />
        </div>

        {/* Category Breakdown */}
        <div className={`p-5 rounded-xl flex flex-col justify-between ${ui.card}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Spending by Category</h2>
              <p className={`text-xs ${ui.muted}`}>November expense share</p>
            </div>
            <button
              onClick={() => onNavigate('budgets')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              Budgets
            </button>
          </div>

          <div className="space-y-3.5 my-auto">
            {metrics.sortedCategories.slice(0, 5).map((cat) => {
              const share =
                metrics.totalSpentMonth > 0
                  ? Math.round((cat.amount / metrics.totalSpentMonth) * 100)
                  : 0;
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.category}
                    </span>
                    <span className="tabular-nums font-semibold">
                      {formatINR(cat.amount)}{' '}
                      <span className={`font-normal ${ui.muted}`}>({share}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800/50 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Grid: Recent Transactions + Smart Insights + Goals & Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className={`p-5 rounded-xl lg:col-span-2 ${ui.card}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold">Recent Transactions</h2>
              <p className={`text-xs ${ui.muted}`}>Click any row to inspect or edit</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View All ({appState.transactions.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {appState.transactions.slice(0, 6).map((tx) => {
              const catMeta = CATEGORIES.find((c) => c.id === tx.category) || CATEGORIES[7];
              return (
                <div
                  key={tx.id}
                  onClick={() => onInspectTx(tx)}
                  className={`py-3 px-2 -mx-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition ${ui.hoverRow}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: catMeta.bg, color: catMeta.color }}
                    >
                      <CategoryIcon name={catMeta.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{tx.description}</div>
                      <div className={`text-xs flex items-center gap-2 mt-0.5 ${ui.muted}`}>
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <PaymentIcon method={tx.method} className="w-3 h-3" />
                          {tx.method}
                        </span>
                        <span className="hidden sm:inline">• {tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold tabular-nums shrink-0 ${
                      tx.type === 'income' ? 'text-emerald-400' : ''
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatINR(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smart Insights + Savings & Upcoming */}
        <div className="space-y-6">
          {/* Smart Financial Observations */}
          <div className={`p-5 rounded-xl ${ui.card}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold">Smart Student Insights</h2>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-indigo-400 hover:underline"
              >
                More
              </button>
            </div>
            <div className="space-y-2.5">
              {insights.slice(0, 2).map((ins) => (
                <div key={ins.id} className={`p-3 rounded-lg text-xs ${ui.cardSubtle}`}>
                  <div className="font-semibold flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        ins.type === 'positive'
                          ? 'bg-emerald-400'
                          : ins.type === 'alert'
                          ? 'bg-rose-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    {ins.title}
                  </div>
                  <p className={`mt-1 leading-relaxed ${ui.muted}`}>{ins.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Goal Quick Card */}
          <div className={`p-5 rounded-xl ${ui.card}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Savings Progress</h2>
              <button
                onClick={() => onNavigate('savings')}
                className="text-xs text-indigo-400 hover:underline"
              >
                All Goals
              </button>
            </div>
            <div className="space-y-3">
              {appState.savingsGoals.slice(0, 2).map((g) => {
                const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
                return (
                  <div key={g.id} className={`p-3 rounded-lg ${ui.cardSubtle}`}>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="truncate">{g.title}</span>
                      <span className="tabular-nums text-indigo-400">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-800/60 my-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: g.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={ui.muted}>
                        {formatINR(g.savedAmount)} / {formatINR(g.targetAmount)}
                      </span>
                      <button
                        onClick={() => onAddGoalFunds(g.id, 200)}
                        className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-medium"
                      >
                        +₹200
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Recurring Payment */}
          <div className={`p-5 rounded-xl ${ui.card}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Upcoming Bills</h2>
              <button
                onClick={() => onNavigate('recurring')}
                className="text-xs text-indigo-400 hover:underline"
              >
                Schedule
              </button>
            </div>
            <div className="space-y-2.5">
              {appState.recurring
                .filter((r) => r.type === 'expense')
                .slice(0, 2)
                .map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-lg flex items-center justify-between gap-2 ${ui.cardSubtle}`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{r.title}</div>
                      <div className={`text-[11px] ${ui.muted}`}>
                        Due {r.nextDate} • {formatINR(r.amount)}
                      </div>
                    </div>
                    <button
                      onClick={() => onLogRecurring(r)}
                      className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-[11px] font-medium shrink-0"
                    >
                      Log Paid
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive SVG Bar Chart for Daily Spending
function DailyBarChart({ series, isDark }) {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...series.map((s) => s.amount), 500);

  return (
    <div className="relative pt-4">
      {hovered && (
        <div className="absolute top-0 right-2 text-xs px-2.5 py-1 rounded-md bg-zinc-900 text-white border border-zinc-700 tabular-nums z-10">
          Nov {hovered.day}: <span className="font-semibold text-indigo-400">{formatINR(hovered.amount)}</span>
        </div>
      )}
      <div className="h-44 flex items-end gap-1 sm:gap-1.5 pt-6">
        {series.map((item) => {
          const heightPct = item.amount === 0 ? 4 : Math.max(8, Math.round((item.amount / maxVal) * 100));
          const isHigh = item.amount > 1000;
          return (
            <div
              key={item.date}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  item.amount === 0
                    ? isDark
                      ? 'bg-zinc-800/50'
                      : 'bg-zinc-200'
                    : isHigh
                    ? 'bg-indigo-500 group-hover:bg-indigo-400'
                    : 'bg-indigo-500/65 group-hover:bg-indigo-400'
                }`}
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[9px] text-zinc-500 mt-1.5 tabular-nums">
                {item.day % 5 === 0 || item.day === 1 ? item.day : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 2. TRANSACTIONS & SMART IMPORT CENTER VIEW
// ============================================================================
function TransactionsView({
  ui,
  isDark,
  transactions,
  onOpenSmartAdd,
  onEditTx,
  onDeleteTx,
  onInspectTx,
  onBatchImport
}) {
  const [subView, setSubView] = useState('ledger'); // 'ledger' | 'import'
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        if (methodFilter !== 'all' && t.method !== methodFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);
          const matchCat = t.category.toLowerCase().includes(q);
          if (!matchDesc && !matchNotes && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
        if (sortBy === 'oldest') return a.date.localeCompare(b.date);
        if (sortBy === 'highest') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'lowest') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [transactions, typeFilter, categoryFilter, methodFilter, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Transactions & Automation</h2>
          <p className={`text-xs ${ui.muted}`}>
            Search, filter, audit your ledger, or import UPI/Bank SMS alerts with duplicate protection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg border flex items-center text-xs font-medium ${ui.card}`}>
            <button
              onClick={() => setSubView('ledger')}
              className={`px-3 py-1.5 rounded-md transition ${
                subView === 'ledger' ? 'bg-indigo-600 text-white' : ui.muted
              }`}
            >
              Ledger ({transactions.length})
            </button>
            <button
              onClick={() => setSubView('import')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                subView === 'import' ? 'bg-indigo-600 text-white' : ui.muted
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Import & SMS Parser
            </button>
          </div>
        </div>
      </div>

      {subView === 'ledger' ? (
        <>
          {/* Search & Filter Toolbar */}
          <div className={`p-4 rounded-xl space-y-3 ${ui.card}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search */}
              <div className="md:col-span-4 relative">
                <Search className={`w-4 h-4 absolute left-3 top-2.5 ${ui.muted}`} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search canteen, UPI, notes..."
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
                />
              </div>

              {/* Type */}
              <div className="md:col-span-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expenses Only</option>
                  <option value="income">Income Only</option>
                </select>
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div className="md:col-span-2">
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
                >
                  <option value="all">All Methods</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table / Responsive List */}
          <div className={`rounded-xl overflow-hidden ${ui.card}`}>
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-medium">No transactions match your filters</p>
                <p className={`text-xs mt-1 ${ui.muted}`}>
                  Try clearing search filters or log a new transaction.
                </p>
                <button
                  onClick={onOpenSmartAdd}
                  className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                >
                  + Add Transaction
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {filteredTransactions.map((tx) => {
                  const catMeta = CATEGORIES.find((c) => c.id === tx.category) || CATEGORIES[7];
                  return (
                    <div
                      key={tx.id}
                      className={`p-4 flex items-center justify-between gap-3 transition ${ui.hoverRow}`}
                    >
                      <div
                        onClick={() => onInspectTx(tx)}
                        className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: catMeta.bg, color: catMeta.color }}
                        >
                          <CategoryIcon name={catMeta.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{tx.description}</span>
                            {tx.source && tx.source !== 'manual' && (
                              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                                {tx.source}
                              </span>
                            )}
                          </div>
                          <div className={`text-xs flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 ${ui.muted}`}>
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <PaymentIcon method={tx.method} className="w-3 h-3" />
                              {tx.method}
                            </span>
                            <span>•</span>
                            <span>
                              {tx.date} {tx.time ? `at ${tx.time}` : ''}
                            </span>
                            {tx.notes && (
                              <>
                                <span>•</span>
                                <span className="italic truncate max-w-[200px]">{tx.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            tx.type === 'income' ? 'text-emerald-400' : ''
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}
                          {formatINR(tx.amount)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditTx(tx)}
                            className={`p-1.5 rounded-lg transition ${ui.muted} hover:text-indigo-400`}
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTx(tx.id)}
                            className={`p-1.5 rounded-lg transition ${ui.muted} hover:text-rose-400`}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <ImportAutomationCenter
          ui={ui}
          isDark={isDark}
          existingTransactions={transactions}
          onBatchImport={(items) => {
            onBatchImport(items);
            setSubView('ledger');
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// PRIVACY-FIRST TRANSACTION IMPORT & SMS PARSER CENTER
// ============================================================================
function ImportAutomationCenter({ ui, existingTransactions, onBatchImport }) {
  const [consentGranted, setConsentGranted] = useState(false);
  const [smsText, setSmsText] = useState(
    'Debited Rs. 240.00 from A/c XX4821 via UPI to Zomato on 25-11-26. UPI Ref 6329104821.'
  );
  const [csvRows, setCsvRows] = useState([]);

  const parsedSms = useMemo(() => {
    const lines = smsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.map((line, idx) => {
      const parsed = parseSmartTransaction(line);
      // Duplicate detection: same amount + same date + similar category/description
      const isDuplicate = existingTransactions.some(
        (ex) =>
          Number(ex.amount) === Number(parsed.amount) &&
          ex.date === parsed.date &&
          ex.type === parsed.type
      );
      return {
        ...parsed,
        tempId: `sms-${idx}`,
        raw: line,
        isDuplicate,
        selected: !isDuplicate && parsed.amount > 0,
        source: 'sms'
      };
    });
  }, [smsText, existingTransactions]);

  const loadSampleStatement = () => {
    const samples = [
      {
        date: '2026-11-24',
        description: 'Dominos Campus Outlet UPI',
        amount: 310,
        type: 'expense',
        category: 'Food & Canteen',
        method: 'UPI'
      },
      {
        date: '2026-11-20',
        description: 'Zomato Biryani Order',
        amount: 340,
        type: 'expense',
        category: 'Food & Canteen',
        method: 'UPI'
      },
      {
        date: '2026-11-25',
        description: 'Gwalior Metro / Auto Pass',
        amount: 150,
        type: 'expense',
        category: 'Travel & Commute',
        method: 'UPI'
      }
    ].map((row, idx) => {
      const isDuplicate = existingTransactions.some(
        (ex) =>
          Number(ex.amount) === Number(row.amount) &&
          ex.date === row.date &&
          ex.type === row.type
      );
      return {
        ...row,
        tempId: `csv-${idx}`,
        time: '14:00',
        notes: 'Imported from UPI statement CSV',
        source: 'csv',
        isDuplicate,
        selected: !isDuplicate
      };
    });
    setCsvRows(samples);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = String(evt.target?.result || '');
      const lines = content.split(/\r?\n/).slice(1).filter(Boolean);
      const parsed = lines.map((line, idx) => {
        const [date = '2026-11-25', desc = 'Imported Entry', amt = '0', type = 'expense', method = 'UPI'] =
          line.split(',').map((s) => s.trim());
        const smart = parseSmartTransaction(`${desc} ${amt} ${method}`);
        const amount = parseFloat(amt) || smart.amount;
        const cleanType = type.toLowerCase().includes('inc') || type.toLowerCase().includes('cr') ? 'income' : 'expense';
        const isDuplicate = existingTransactions.some(
          (ex) => Number(ex.amount) === amount && ex.date === date && ex.type === cleanType
        );
        return {
          tempId: `csv-file-${idx}`,
          date,
          time: '12:00',
          description: desc,
          amount,
          type: cleanType,
          category: smart.category,
          method: PAYMENT_METHODS.includes(method) ? method : smart.method,
          notes: 'CSV Statement Import',
          source: 'csv',
          isDuplicate,
          selected: !isDuplicate && amount > 0
        };
      });
      setCsvRows(parsed);
    };
    reader.readAsText(file);
  };

  const commitSmsImport = () => {
    const toImport = parsedSms
      .filter((item) => item.selected && item.amount > 0)
      .map(({ tempId, raw, isDuplicate, selected, confidence, ...tx }) => ({
        ...tx,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        notes: 'Parsed from SMS alert'
      }));
    if (toImport.length > 0) onBatchImport(toImport);
  };

  const commitCsvImport = () => {
    const toImport = csvRows
      .filter((item) => item.selected && item.amount > 0)
      .map(({ tempId, isDuplicate, selected, ...tx }) => ({
        ...tx,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)
      }));
    if (toImport.length > 0) onBatchImport(toImport);
  };

  return (
    <div className="space-y-6">
      {/* Privacy & Consent Banner */}
      <div className={`p-5 rounded-xl border-indigo-500/30 ${ui.card}`}>
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Privacy-First Local Parsing & Duplicate Guard</h3>
            <p className={`text-xs mt-1 leading-relaxed ${ui.muted}`}>
              CampusLedger does not connect directly to external bank servers. All SMS alerts and CSV statements are parsed locally in your browser and checked against existing entries to prevent duplicates.
            </p>
            <label className="mt-3 inline-flex items-center gap-2.5 text-xs font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span>I consent to locally parsing my pasted SMS alerts / CSV statement rows.</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMS Alert Parser */}
        <div className={`p-5 rounded-xl space-y-4 ${ui.card}`}>
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold">Bank / UPI SMS Alert Parser</h3>
          </div>
          <p className={`text-xs ${ui.muted}`}>
            Paste one or more bank/UPI SMS notifications below (one per line).
          </p>
          <textarea
            rows={4}
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            className={`w-full p-3 rounded-lg border text-xs font-mono outline-none ${ui.input}`}
            placeholder="Paste bank SMS alert..."
          />

          <div className="space-y-2">
            <div className="text-xs font-medium">Detected Preview ({parsedSms.length})</div>
            {parsedSms.map((item) => (
              <div
                key={item.tempId}
                className={`p-3 rounded-lg flex items-center justify-between gap-2 text-xs ${ui.cardSubtle}`}
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <span>{item.description}</span>
                    {item.isDuplicate && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-semibold">
                        Duplicate Flagged
                      </span>
                    )}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${ui.muted}`}>
                    {item.category} • {item.method} • {item.date}
                  </div>
                </div>
                <span className="font-semibold tabular-nums">{formatINR(item.amount)}</span>
              </div>
            ))}
          </div>

          <button
            disabled={!consentGranted || parsedSms.filter((i) => i.selected).length === 0}
            onClick={commitSmsImport}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium transition"
          >
            Import Non-Duplicate SMS Transactions ({parsedSms.filter((i) => i.selected).length})
          </button>
        </div>

        {/* CSV Statement Import */}
        <div className={`p-5 rounded-xl space-y-4 ${ui.card}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold">UPI / Bank Statement CSV Import</h3>
            </div>
            <button
              onClick={loadSampleStatement}
              className="text-xs text-indigo-400 hover:underline font-medium"
            >
              Load Sample UPI CSV
            </button>
          </div>
          <p className={`text-xs ${ui.muted}`}>
            Upload a CSV with columns: <code className="text-indigo-400">date, description, amount, type, method</code>
          </p>

          <label
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition ${ui.cardSubtle}`}
          >
            <Upload className="w-5 h-5 text-indigo-400 mb-1.5" />
            <span className="text-xs font-medium">Choose .CSV Statement File</span>
            <span className={`text-[11px] mt-0.5 ${ui.muted}`}>Auto-categorizes & checks duplicates</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {csvRows.length > 0 && (
            <div className="space-y-2">
              {csvRows.map((row) => (
                <div
                  key={row.tempId}
                  className={`p-3 rounded-lg flex items-center justify-between gap-2 text-xs ${ui.cardSubtle}`}
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{row.description}</span>
                      {row.isDuplicate && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px]">
                          Duplicate Skipped
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] ${ui.muted}`}>
                      {row.date} • {row.category}
                    </div>
                  </div>
                  <span className="font-semibold tabular-nums">{formatINR(row.amount)}</span>
                </div>
              ))}
              <button
                disabled={!consentGranted || csvRows.filter((r) => r.selected).length === 0}
                onClick={commitCsvImport}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-medium transition"
              >
                Import {csvRows.filter((r) => r.selected).length} Verified Rows
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. BUDGETS & MONTHLY ALLOWANCE VIEW
// ============================================================================
function BudgetsView({ ui, appState, metrics, onSaveBudgets }) {
  const [allowanceInput, setAllowanceInput] = useState(appState.profile.monthlyAllowance);
  const [draftBudgets, setDraftBudgets] = useState(appState.budgets);

  const totalCategoryAllocated = Object.values(draftBudgets).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  const handleSave = (e) => {
    e.preventDefault();
    onSaveBudgets(allowanceInput, draftBudgets);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Monthly Allowance & Category Limits</h2>
          <p className={`text-xs ${ui.muted}`}>
            Set your pocket money cap and realistic student category guardrails
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition self-start sm:self-auto"
        >
          Save Budget Plan
        </button>
      </div>

      {/* Master Monthly Allowance Card */}
      <div className={`p-5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center ${ui.card}`}>
        <div>
          <label className="text-xs font-medium block mb-1.5">Monthly Student Allowance (₹)</label>
          <input
            type="number"
            min="500"
            step="100"
            value={allowanceInput}
            onChange={(e) => setAllowanceInput(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-base font-semibold tabular-nums outline-none ${ui.input}`}
          />
          <p className={`text-[11px] mt-1.5 ${ui.muted}`}>
            Category envelopes sum to {formatINR(totalCategoryAllocated)}
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">
              Overall November Utilization ({formatINR(metrics.totalSpentMonth)} of{' '}
              {formatINR(allowanceInput)})
            </span>
            <span className="font-semibold tabular-nums">
              {Math.round((metrics.totalSpentMonth / (Number(allowanceInput) || 1)) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-800/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((metrics.totalSpentMonth / (Number(allowanceInput) || 1)) * 100)
                )}%`
              }}
            />
          </div>
          <div className={`flex justify-between text-[11px] ${ui.muted}`}>
            <span>Remaining: {formatINR(Math.max(0, Number(allowanceInput) - metrics.totalSpentMonth))}</span>
            <span>6 days left in November</span>
          </div>
        </div>
      </div>

      {/* Per-Category Budget Envelopes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.filter((c) => c.id !== 'Allowance & Income').map((cat) => {
          const spent = metrics.categorySpend[cat.id] || 0;
          const limit = Number(draftBudgets[cat.id]) || 0;
          const prevMonth = appState.previousMonthTotals[cat.id] || 0;
          const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;

          let barColor = 'bg-emerald-500';
          let statusBadge = { text: 'Healthy', cls: 'bg-emerald-500/15 text-emerald-400' };
          if (pct >= 100) {
            barColor = 'bg-rose-500';
            statusBadge = { text: 'Exceeded', cls: 'bg-rose-500/15 text-rose-400' };
          } else if (pct >= 75) {
            barColor = 'bg-amber-500';
            statusBadge = { text: 'Approaching Limit', cls: 'bg-amber-500/15 text-amber-400' };
          }

          return (
            <div key={cat.id} className={`p-5 rounded-xl space-y-3.5 ${ui.card}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{cat.label}</div>
                    <div className={`text-[11px] ${ui.muted}`}>
                      Last month: {formatINR(prevMonth)}
                    </div>
                  </div>
                </div>

                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${statusBadge.cls}`}>
                  {statusBadge.text}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span>
                    Spent: <strong>{formatINR(spent)}</strong>
                  </span>
                  <span className={ui.muted}>
                    {limit - spent >= 0
                      ? `${formatINR(limit - spent)} left`
                      : `${formatINR(spent - limit)} over`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-3">
                <label className={`text-xs ${ui.muted}`}>Monthly Limit (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={draftBudgets[cat.id] ?? 0}
                  onChange={(e) =>
                    setDraftBudgets((prev) => ({ ...prev, [cat.id]: Number(e.target.value) }))
                  }
                  className={`w-32 px-2.5 py-1.5 rounded-lg border text-xs text-right font-semibold tabular-nums outline-none ${ui.input}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}

// ============================================================================
// 4. ANALYTICS & SMART INSIGHTS VIEW
// ============================================================================
function AnalyticsView({ ui, isDark, appState, metrics, insights }) {
  const prevTotalSpent = Object.values(appState.previousMonthTotals).reduce((a, b) => a + b, 0);
  const momDiff = metrics.totalSpentMonth - prevTotalSpent;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Analytics & Financial Intelligence</h2>
        <p className={`text-xs ${ui.muted}`}>
          Live behavioral observations, November spending calendar heatmap, and month-over-month trends
        </p>
      </div>

      {/* Data-Driven Smart Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins) => (
          <div key={ins.id} className={`p-4 rounded-xl flex items-start gap-3.5 ${ui.card}`}>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                ins.type === 'positive'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : ins.type === 'alert'
                  ? 'bg-rose-500/15 text-rose-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {ins.type === 'positive' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{ins.title}</h3>
              <p className={`text-xs mt-1 leading-relaxed ${ui.muted}`}>{ins.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Income vs Expense & Monthly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spending Heatmap Calendar (Nov 2026) */}
        <div className={`p-5 rounded-xl ${ui.card}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">November Spending Heatmap</h3>
              <p className={`text-xs ${ui.muted}`}>Intensity of daily out-of-pocket expenses</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span>₹0</span>
              <span className="w-3 h-3 rounded-xs bg-zinc-800/60" />
              <span className="w-3 h-3 rounded-xs bg-indigo-500/35" />
              <span className="w-3 h-3 rounded-xs bg-indigo-500/70" />
              <span className="w-3 h-3 rounded-xs bg-indigo-500" />
              <span>₹500+</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className={`font-medium pb-1 ${ui.muted}`}>
                {d}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, idx) => {
              const dayNum = idx + 1;
              const entry = metrics.dailySeries.find((s) => s.day === dayNum);
              const amt = entry ? entry.amount : 0;
              let cellBg = isDark ? 'bg-zinc-900 text-zinc-500' : 'bg-zinc-100 text-zinc-400';
              if (amt > 0 && amt <= 200) cellBg = 'bg-indigo-500/30 text-indigo-200 font-medium';
              else if (amt > 200 && amt <= 500) cellBg = 'bg-indigo-500/65 text-white font-semibold';
              else if (amt > 500) cellBg = 'bg-indigo-500 text-white font-bold';

              return (
                <div
                  key={dayNum}
                  title={`Nov ${dayNum}: ${formatINR(amt)}`}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center border border-transparent hover:border-indigo-400 transition ${cellBg}`}
                >
                  <span>{dayNum}</span>
                  {amt > 0 && <span className="text-[9px] opacity-85">₹{amt}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Month-over-Month Comparison */}
        <div className={`p-5 rounded-xl flex flex-col justify-between ${ui.card}`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold">November vs October Comparison</h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  momDiff <= 0
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {momDiff <= 0 ? `${formatINR(Math.abs(momDiff))} lower` : `+${formatINR(momDiff)} higher`}
              </span>
            </div>
            <p className={`text-xs mb-4 ${ui.muted}`}>
              October total: {formatINR(prevTotalSpent)} • November so far: {formatINR(metrics.totalSpentMonth)}
            </p>
          </div>

          <div className="space-y-3.5">
            {metrics.sortedCategories.map((cat) => {
              const prev = appState.previousMonthTotals[cat.category] || 0;
              const maxBar = Math.max(cat.amount, prev, 100);
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{cat.category}</span>
                    <span className="tabular-nums text-zinc-400">
                      Nov <strong className={isDark ? 'text-zinc-100' : 'text-zinc-900'}>{formatINR(cat.amount)}</strong> vs Oct {formatINR(prev)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-zinc-800/50 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((cat.amount / maxBar) * 100)}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                    <div className="w-full h-1 rounded-full bg-zinc-800/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-zinc-500/50"
                        style={{ width: `${Math.round((prev / maxBar) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. SAVINGS GOALS VIEW
// ============================================================================
function SavingsGoalsView({ ui, goals, onAddFunds, onCreateGoal, onDeleteGoal }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [targetDate, setTargetDate] = useState('2027-04-01');
  const [customDeposit, setCustomDeposit] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;
    onCreateGoal({
      title: title.trim(),
      category: 'Personal Goal',
      targetAmount: Number(targetAmount),
      savedAmount: Number(savedAmount) || 0,
      targetDate,
      color: '#6366f1'
    });
    setTitle('');
    setTargetAmount('');
    setSavedAmount('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Student Savings Goals</h2>
          <p className={`text-xs ${ui.muted}`}>
            Build your emergency fund, save for semester trips, or upgrade your study gear
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`p-5 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-4 ${ui.card}`}>
          <div>
            <label className="text-xs font-medium block mb-1">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g., iPad for Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Target Amount (₹)</label>
            <input
              type="number"
              required
              min="100"
              placeholder="25000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Initial Deposit (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="2000"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <label className="text-xs font-medium block mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
              />
            </div>
          </div>
          <div className="sm:col-span-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-2 rounded-lg border border-inherit text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
            >
              Create Goal
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          return (
            <div key={goal.id} className={`p-5 rounded-xl flex flex-col justify-between space-y-4 ${ui.card}`}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                      Target: {goal.targetDate}
                    </span>
                    <h3 className="text-base font-semibold mt-2">{goal.title}</h3>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className={`p-1.5 rounded-lg ${ui.muted} hover:text-rose-400`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold tabular-nums">{formatINR(goal.savedAmount)}</span>
                    <span className={`text-xs tabular-nums ${ui.muted}`}>
                      of {formatINR(goal.targetAmount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-800/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: goal.color }}
                    />
                  </div>
                  <p className={`text-[11px] ${ui.muted}`}>
                    {remaining === 0
                      ? 'Goal completed! Ready to redeem.'
                      : `${formatINR(remaining)} more needed`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-inherit space-y-2">
                <div className="flex items-center gap-1.5">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => onAddFunds(goal.id, amt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${ui.cardSubtle} hover:border-indigo-500`}
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom ₹"
                    value={customDeposit[goal.id] || ''}
                    onChange={(e) =>
                      setCustomDeposit((prev) => ({ ...prev, [goal.id]: e.target.value }))
                    }
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none ${ui.input}`}
                  />
                  <button
                    onClick={() => {
                      onAddFunds(goal.id, customDeposit[goal.id]);
                      setCustomDeposit((prev) => ({ ...prev, [goal.id]: '' }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 6. RECURRING TRANSACTIONS & SUBSCRIPTIONS VIEW
// ============================================================================
function RecurringView({ ui, recurring, onLogNow, onCreateRecurring, onDeleteRecurring }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Subscriptions');
  const [method, setMethod] = useState('UPI');
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDate, setNextDate] = useState('2026-12-05');

  const monthlyRecurringBurn = recurring
    .filter((r) => r.type === 'expense')
    .reduce((acc, r) => acc + Number(r.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    onCreateRecurring({
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      method,
      frequency,
      nextDate,
      autoLog: false
    });
    setTitle('');
    setAmount('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Recurring Bills & Subscriptions</h2>
          <p className={`text-xs ${ui.muted}`}>
            Fixed monthly commitments total <strong className="text-indigo-400">{formatINR(monthlyRecurringBurn)}/mo</strong>
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> Add Schedule
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`p-5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 ${ui.card}`}>
          <div>
            <label className="text-xs font-medium block mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Mess Fee / Netflix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            >
              <option value="expense">Expense</option>
              <option value="income">Income (Allowance)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Next Due Date</label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>
          <div className="sm:col-span-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-2 rounded-lg border border-inherit text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium">
              Save Schedule
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurring.map((item) => {
          const catMeta = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[7];
          return (
            <div key={item.id} className={`p-5 rounded-xl flex items-center justify-between gap-4 ${ui.card}`}>
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: catMeta.bg, color: catMeta.color }}
                >
                  <CategoryIcon name={catMeta.icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{item.title}</div>
                  <div className={`text-xs flex items-center gap-2 mt-1 ${ui.muted}`}>
                    <span>{item.frequency}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Next: {item.nextDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-sm font-bold tabular-nums ${
                      item.type === 'income' ? 'text-emerald-400' : ''
                    }`}
                  >
                    {item.type === 'income' ? '+' : ''}
                    {formatINR(item.amount)}
                  </div>
                  <div className={`text-[11px] ${ui.muted}`}>{item.method}</div>
                </div>

                <button
                  onClick={() => onLogNow(item)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                >
                  Log Now
                </button>
                <button
                  onClick={() => onDeleteRecurring(item.id)}
                  className={`p-1.5 rounded-lg ${ui.muted} hover:text-rose-400`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SMART NATURAL-LANGUAGE ADD / EDIT MODAL
// ============================================================================
function SmartTransactionModal({ isDark, ui, initialTx, onClose, onSave }) {
  const [nlpInput, setNlpInput] = useState('');
  const [form, setForm] = useState(() =>
    initialTx
      ? { ...initialTx }
      : {
          type: 'expense',
          amount: '',
          category: 'Food & Canteen',
          method: 'UPI',
          description: '',
          notes: '',
          date: '2026-11-25',
          time: '13:30',
          source: 'manual'
        }
  );

  const handleNlpChange = (val) => {
    setNlpInput(val);
    if (!val.trim()) return;
    const parsed = parseSmartTransaction(val);
    setForm((prev) => ({
      ...prev,
      type: parsed.type,
      amount: parsed.amount || prev.amount,
      category: parsed.category,
      method: parsed.method,
      description: parsed.description,
      date: parsed.date,
      source: 'nlp'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0 || !form.description.trim()) return;
    onSave({
      ...form,
      amount: Number(form.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />
      <div
        className={`relative w-full max-w-lg rounded-2xl border p-6 z-10 shadow-2xl ${
          isDark ? 'bg-[#121215] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-semibold">
              {initialTx ? 'Edit Transaction' : 'Smart Transaction Entry'}
            </h3>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${ui.hoverRow}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NLP Magic Box */}
        {!initialTx && (
          <div className={`p-3.5 rounded-xl mb-5 ${ui.cardSubtle}`}>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 block mb-1.5">
              Natural Language Auto-Fill
            </label>
            <input
              type="text"
              autoFocus
              value={nlpInput}
              onChange={(e) => handleNlpChange(e.target.value)}
              placeholder='e.g. "Spent ₹120 on lunch using UPI" or "Received ₹5000 allowance"'
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${ui.input}`}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                'Spent ₹80 on chai and samosa via UPI',
                '₹150 auto to railway station cash',
                'Received ₹2000 internship stipend'
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleNlpChange(preset)}
                  className={`text-[10px] px-2 py-1 rounded-md border border-inherit hover:border-indigo-500 transition ${ui.muted}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-zinc-900/50 border border-zinc-800/70">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: 'expense' }))}
              className={`py-2 rounded-md text-xs font-semibold transition ${
                form.type === 'expense'
                  ? 'bg-rose-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, type: 'income', category: 'Allowance & Income' }))
              }
              className={`py-2 rounded-md text-xs font-semibold transition ${
                form.type === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Income / Allowance (+)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium block mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="120"
                className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold tabular-nums outline-none ${ui.input}`}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Payment Method</label>
              <select
                value={form.method}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Description *</label>
            <input
              type="text"
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Canteen lunch, Hostel fee, Auto ride..."
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Time</label>
              <input
                type="time"
                value={form.time || '12:00'}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={form.notes || ''}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Split with friends, receipt ref, etc."
              className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${ui.input}`}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-inherit text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              {initialTx ? 'Save Changes' : 'Confirm & Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// TRANSACTION DETAIL INSPECTOR MODAL
// ============================================================================
function TransactionDetailModal({ isDark, ui, tx, onClose, onEdit, onDelete }) {
  const catMeta = CATEGORIES.find((c) => c.id === tx.category) || CATEGORIES[7];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={onClose} />
      <div
        className={`relative w-full max-w-md rounded-2xl border p-6 z-10 shadow-2xl space-y-5 ${
          isDark ? 'bg-[#121215] border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Transaction Receipt
          </span>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${ui.hoverRow}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: catMeta.bg, color: catMeta.color }}
          >
            <CategoryIcon name={catMeta.icon} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{tx.description}</h3>
            <div
              className={`text-2xl font-bold tabular-nums mt-0.5 ${
                tx.type === 'income' ? 'text-emerald-400' : ''
              }`}
            >
              {tx.type === 'income' ? '+' : '-'}
              {formatINR(tx.amount)}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl space-y-2.5 text-xs ${ui.cardSubtle}`}>
          <div className="flex justify-between">
            <span className={ui.muted}>Category</span>
            <span className="font-medium">{tx.category}</span>
          </div>
          <div className="flex justify-between">
            <span className={ui.muted}>Payment Method</span>
            <span className="font-medium">{tx.method}</span>
          </div>
          <div className="flex justify-between">
            <span className={ui.muted}>Date & Time</span>
            <span className="font-medium">
              {tx.date} {tx.time ? `• ${tx.time}` : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={ui.muted}>Entry Source</span>
            <span className="font-medium uppercase">{tx.source || 'Manual'}</span>
          </div>
          {tx.notes && (
            <div className="pt-2 border-t border-inherit">
              <span className={`block mb-1 ${ui.muted}`}>Notes</span>
              <p className="font-medium">{tx.notes}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onDelete(tx.id)}
            className="px-3.5 py-2 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 text-xs font-medium flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button
            onClick={() => onEdit(tx)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// NOTIFICATION CENTER POPOVER
// ============================================================================
function NotificationPopover({
  isDark,
  ui,
  notifications,
  settings,
  onToggleSetting,
  onMarkAllRead,
  onClose
}) {
  const [tab, setTab] = useState('alerts');

  return (
    <div
      className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border shadow-2xl z-40 overflow-hidden ${
        isDark ? 'bg-[#121215] border-zinc-800' : 'bg-white border-zinc-200'
      }`}
    >
      <div className="px-4 py-3 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('alerts')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              tab === 'alerts' ? 'bg-indigo-600 text-white' : ui.muted
            }`}
          >
            Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setTab('prefs')}
            className={`text-xs font-semibold px-2 py-1 rounded ${
              tab === 'prefs' ? 'bg-indigo-600 text-white' : ui.muted
            }`}
          >
            Preferences
          </button>
        </div>
        <div className="flex items-center gap-2">
          {tab === 'alerts' && notifications.length > 0 && (
            <button onClick={onMarkAllRead} className="text-[11px] text-indigo-400 hover:underline">
              Clear all
            </button>
          )}
          <button onClick={onClose} className="p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {tab === 'alerts' ? (
        <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/50">
          {notifications.length === 0 ? (
            <div className={`p-8 text-center text-xs ${ui.muted}`}>
              You're all caught up! No active budget warnings or due bills.
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-400">{n.category}</span>
                  <span className={`text-[10px] ${ui.muted}`}>{n.time}</span>
                </div>
                <div className="font-medium">{n.title}</div>
                <p className={ui.muted}>{n.body}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="p-4 space-y-3 text-xs">
          {[
            { key: 'budgetWarnings', label: 'Budget Limit Warnings (75%+)' },
            { key: 'recurringReminders', label: 'Upcoming Recurring Bill Reminders' },
            { key: 'savingsMilestones', label: 'Savings Goal Milestone Alerts' },
            { key: 'spendingTrends', label: 'Weekly Spending Trend Summaries' }
          ].map((pref) => (
            <label key={pref.key} className="flex items-center justify-between cursor-pointer">
              <span>{pref.label}</span>
              <input
                type="checkbox"
                checked={settings[pref.key]}
                onChange={() => onToggleSetting(pref.key)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}