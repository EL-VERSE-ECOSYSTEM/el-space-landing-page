'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft,
  Send, History, Shield, Info, CreditCard,
  ChevronRight, RefreshCw, Lock, DollarSign,
  Building, Globe, Smartphone, Banknote, Plus, TrendingUp
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'
import { DashboardLayout } from '@/components/dashboard/auth-guard'
import { convertCurrency, formatCurrency } from '@/lib/exchange-rates'

export default function WalletHub() {
  const navItems = [
    { label: 'Feed', href: '/feed' },
    { label: 'Messages', href: '/messages' },
    { label: 'Settings', href: '/settings' },
  ]

  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  // Withdrawal State
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showFund, setShowFund] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto'>('bank')
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    currency: 'USD',
    accountNumber: '',
    bankName: '',
    walletAddress: '',
    network: 'Ethereum (ERC20)',
    pin: ''
  })

  const [transferData, setTransferData] = useState({
    recipientId: '',
    amount: '',
    pin: ''
  })

  const [fundData, setFundData] = useState({
    amount: '',
    currency: 'USD',
    method: 'bank_transfer',
    receiptUrl: ''
  })

  useEffect(() => {
    if (user) {
      fetchWalletData()
    }
  }, [user])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      const [walletRes, txRes] = await Promise.all([
        fetch(`/api/wallet?userId=${user?.id}`),
        fetch(`/api/wallet?userId=${user?.id}&action=transactions`)
      ])
      
      const walletData = await walletRes.json()
      const txData = await txRes.json()
      
      if (walletData.success) setWallet(walletData.wallet)
      if (txData.success) setTransactions(txData.transactions || [])
    } catch (err) {
      toast.error('Financial sync failed')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawData.amount || !withdrawData.pin) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          type: 'withdraw',
          amount: parseFloat(withdrawData.amount),
          transactionPin: withdrawData.pin,
          currency: withdrawData.currency,
          method: withdrawMethod,
          accountDetails: withdrawMethod === 'bank' ? {
            accountNumber: withdrawData.accountNumber,
            bankName: withdrawData.bankName
          } : {
            address: withdrawData.walletAddress,
            network: withdrawData.network
          }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Withdrawal request initiated!')
        setShowWithdraw(false)
        setWithdrawData({ amount: '', currency: 'USD', accountNumber: '', bankName: '', walletAddress: '', network: 'Ethereum (ERC20)', pin: '' })
        fetchWalletData()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Withdrawal execution error')
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!transferData.recipientId || !transferData.amount || !transferData.pin) {
      toast.error('Please complete all transfer details')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.id,
          recipientSpaceId: transferData.recipientId,
          amount: parseFloat(transferData.amount),
          transactionPin: transferData.pin
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Internal transfer successful!')
        setShowTransfer(false)
        setTransferData({ recipientId: '', amount: '', pin: '' })
        fetchWalletData()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Transfer execution failed')
    } finally {
      setLoading(false)
    }
  }

  const handleFund = async () => {
    if (!fundData.amount || !fundData.receiptUrl) {
      toast.error('Please provide amount and receipt proof')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: parseFloat(fundData.amount),
          currency: fundData.currency,
          method: fundData.method,
          receiptUrl: fundData.receiptUrl
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Deposit submitted! Awaiting verification.')
        setShowFund(false)
        setFundData({ amount: '', currency: 'USD', method: 'bank_transfer', receiptUrl: '' })
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Funding process failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !wallet) return <div className="min-h-screen bg-background flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout navItems={navItems} userType={(user?.user_type === "freelancer" ? "freelancer" : "client")}>
      <div className="min-h-screen text-foreground pb-20">
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-5xl font-black text-foreground tracking-tighter flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                  <WalletIcon className="w-7 h-7 text-primary-foreground" />
                </div>
                The <span className="bg-gradient-to-r from-primary to-slate-500 bg-clip-text text-transparent uppercase">Vault</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg font-medium">Secured liquidity & asset management</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button onClick={() => setShowTransfer(true)} className="flex-1 md:flex-none h-14 bg-card border border-border text-foreground hover:bg-muted font-black px-8 rounded-2xl transition-all">
                <Send className="w-5 h-5 mr-2" /> Transfer
              </Button>
              <Button onClick={() => setShowWithdraw(true)} className="flex-1 md:flex-none h-14 bg-card border border-border text-foreground hover:bg-muted font-black px-8 rounded-2xl transition-all">
                <ArrowUpRight className="w-5 h-5 mr-2" /> Withdraw
              </Button>
              <Button onClick={() => setShowFund(true)} className="flex-1 md:flex-none h-14 bg-primary hover:opacity-90 text-primary-foreground font-black px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all border-none">
                <Plus className="w-5 h-5 mr-2" /> Fund
              </Button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-card border border-border rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Liquid Balance</span>
                </div>
                <h2 className="text-6xl font-black text-foreground tracking-tighter">${wallet?.balance?.toLocaleString() || '0.00'}</h2>
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-success text-xs font-bold uppercase tracking-widest">Available for Instant Pay</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-warning/10 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-warning" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Escrow / Pending</span>
                </div>
                <h2 className="text-6xl font-black text-foreground tracking-tighter">${wallet?.pending_balance?.toLocaleString() || '0.00'}</h2>
                <p className="mt-8 text-muted-foreground text-xs font-bold uppercase tracking-widest">Protected by Platform Escrow</p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lifetime Yield</span>
                </div>
                <h2 className="text-6xl font-black text-foreground tracking-tighter">${wallet?.total_earned?.toLocaleString() || '0.00'}</h2>
                <p className="mt-8 text-muted-foreground text-xs font-bold uppercase tracking-widest">Total ecosystem earnings</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Ledger */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-4">
                  <History className="w-8 h-8 text-muted-foreground" />
                  Ledger <span className="text-muted-foreground font-medium text-lg">/ Operations</span>
                </h2>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-black h-12 rounded-xl" onClick={fetchWalletData}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Sync
                </Button>
              </div>

              <div className="space-y-4">
                 {transactions.length > 0 ? transactions.map((tx) => (
                   <div key={tx.id} className="bg-card border border-border p-6 rounded-[2rem] flex items-center justify-between hover:border-primary/30 hover:bg-muted/50 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                            tx.amount > 0 ? 'bg-success/20 text-success group-hover:bg-success group-hover:text-success-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'
                         }`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                         </div>
                         <div>
                            <p className="text-foreground font-black text-lg tracking-tight">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                               <div className="w-1 h-1 rounded-full bg-border" />
                               <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{tx.type}</p>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-black text-2xl tracking-tighter ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                         </p>
                         <div className="flex justify-end mt-1">
                            <Badge className={`text-[9px] border-none px-3 py-0.5 rounded-lg font-black tracking-widest uppercase ${
                              tx.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>{tx.status}</Badge>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-24 text-center bg-card border-2 border-dashed border-border rounded-[3rem]">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
                         <Info className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-muted-foreground font-bold text-lg">No operations recorded yet.</p>
                      <p className="text-muted-foreground/60 text-sm mt-1">Your ledger will populate as you scale.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Security & ID */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                 <h3 className="text-foreground font-black text-xl mb-8 flex items-center gap-3 relative z-10 uppercase">
                    <Shield className="w-6 h-6 text-primary" />
                    Security Framework
                 </h3>
                 <div className="space-y-4 relative z-10">
                    <div className="p-6 bg-muted rounded-2xl border border-border flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Space Identity</p>
                          <p className="font-mono text-primary font-black text-lg">{user?.el_space_id}</p>
                       </div>
                       <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted rounded-2xl border border-border">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                             <Lock className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <span className="text-foreground font-bold">Transaction PIN</span>
                       </div>
                       <Badge className="bg-success/10 text-success border-none font-black text-[10px]">ACTIVE</Badge>
                    </div>
                 </div>
              </Card>

              <Card className="bg-gradient-to-br from-primary to-slate-600 border-none p-8 rounded-[2.5rem] text-primary-foreground shadow-2xl shadow-primary/20">
                 <h3 className="font-black text-xl mb-4 uppercase">Elite Benefits</h3>
                 <p className="text-primary-foreground/80 font-medium mb-6">You're currently in the <span className="text-primary-foreground font-black">Platinum Tier</span> with 0.5% reduced fees.</p>
                 <Button className="w-full bg-background text-foreground hover:bg-background/90 font-black rounded-xl h-12 border-none">Upgrade Pipeline</Button>
              </Card>
            </div>
          </div>
        </main>

        {/* Transfer Modal */}
        {showTransfer && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-slate-500" />
                <CardHeader className="p-10 pb-4">
                   <CardTitle className="text-3xl font-black text-foreground tracking-tight uppercase">Internal Transfer</CardTitle>
                   <p className="text-muted-foreground font-medium mt-1">Send funds instantly via EL SPACE ID.</p>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                   <div className="p-10 pt-0 space-y-8">
                      <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-center gap-3">
                         <Info className="w-5 h-5 text-warning" />
                         <p className="text-xs font-bold text-warning-foreground">Internal transfers attract a <span className="text-foreground">2.5% platform fee</span>.</p>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Recipient EL SPACE ID</label>
                         <div className="relative">
                            <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                               placeholder="e.g. ELS1234567"
                               className="bg-muted border-border pl-14 h-16 text-foreground font-black text-xl rounded-2xl focus:ring-primary"
                               value={transferData.recipientId}
                               onChange={e => setTransferData({...transferData, recipientId: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Amount ($)</label>
                            <Input
                               type="number"
                               placeholder="0.00"
                               className="bg-muted border-border h-16 text-foreground font-black text-xl rounded-2xl focus:ring-primary"
                               value={transferData.amount}
                               onChange={e => setTransferData({...transferData, amount: e.target.value})}
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Secure PIN</label>
                            <Input
                               type="password"
                               placeholder="••••"
                               maxLength={4}
                               className="bg-muted border-border h-16 text-foreground tracking-[0.5em] text-center font-black text-xl rounded-2xl focus:ring-primary"
                               value={transferData.pin}
                               onChange={e => setTransferData({...transferData, pin: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-6">
                      <Button variant="ghost" className="flex-1 h-14 text-muted-foreground font-black text-lg rounded-2xl hover:bg-muted" onClick={() => setShowTransfer(false)}>Cancel</Button>
                      <Button
                         className="flex-[2] h-14 bg-primary hover:opacity-90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all border-none"
                         onClick={handleTransfer}
                      >
                         Execute Transfer
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

        {/* Withdrawal Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-slate-500" />
                <CardHeader className="p-10 pb-4">
                   <CardTitle className="text-3xl font-black text-foreground tracking-tight uppercase">Capital Withdrawal</CardTitle>
                   <p className="text-muted-foreground font-medium mt-1">Select your preferred liquidity destination.</p>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                   <Tabs value={withdrawMethod} onValueChange={(v: any) => setWithdrawMethod(v)} className="w-full">
                      <TabsList className="bg-muted border border-border p-1 rounded-2xl w-full mb-8">
                         <TabsTrigger value="bank" className="flex-1 rounded-xl py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-sm">
                            <Building className="w-4 h-4 mr-2" /> Bank Settlement
                         </TabsTrigger>
                         <TabsTrigger value="crypto" className="flex-1 rounded-xl py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-black text-sm">
                            <Globe className="w-4 h-4 mr-2" /> Crypto Protocol
                         </TabsTrigger>
                      </TabsList>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Asset Class</label>
                              <select
                                 className="w-full bg-muted border-border h-16 text-foreground font-black rounded-2xl px-4 outline-none"
                                 value={withdrawData.currency}
                                 onChange={e => setWithdrawData({...withdrawData, currency: e.target.value})}
                              >
                                 <option value="USD">USD - Dollar</option>
                                 <option value="NGN">NGN - Naira</option>
                                 <option value="GBP">GBP - Pound</option>
                                 <option value="EUR">EUR - Euro</option>
                                 <option value="USDT">USDT - Stable</option>
                                 <option value="ETH">ETH - Ethereum</option>
                                 <option value="SOL">SOL - Solana</option>
                              </select>
                           </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Volume ({withdrawData.currency})</label>
                              <Input
                                 type="number"
                                 placeholder="0.00"
                                 className="bg-muted border-border h-16 text-foreground font-black text-xl rounded-2xl focus:ring-primary"
                                 value={withdrawData.amount}
                                 onChange={e => setWithdrawData({...withdrawData, amount: e.target.value})}
                              />
                              {withdrawData.amount && withdrawData.currency !== 'USD' && (
                                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                                  Approx. {formatCurrency(convertCurrency(parseFloat(withdrawData.amount), withdrawData.currency, 'USD'), 'USD')}
                                </p>
                              )}
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Auth PIN</label>
                              <div className="relative">
                                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                 <Input
                                    type="password"
                                    placeholder="••••"
                                    maxLength={4}
                                    className="bg-muted border-border pl-14 h-16 text-foreground tracking-[0.5em] text-center font-black text-xl rounded-2xl focus:ring-primary"
                                    value={withdrawData.pin}
                                    onChange={e => setWithdrawData({...withdrawData, pin: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>
                        </div>

                        {withdrawMethod === 'bank' ? (
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Institution Name</label>
                                 <select
                                    className="w-full bg-muted border-border h-14 text-foreground font-bold rounded-xl px-4 outline-none"
                                    value={withdrawData.bankName}
                                    onChange={e => setWithdrawData({...withdrawData, bankName: e.target.value})}
                                 >
                                    <option value="">Select your bank</option>
                                    {withdrawData.currency === 'NGN' && (
                                       <>
                                          <option>Access Bank</option>
                                          <option>GTBank</option>
                                          <option>Zenith Bank</option>
                                          <option>UBA</option>
                                          <option>First Bank</option>
                                          <option>Opay</option>
                                          <option>Palmpay</option>
                                          <option>Moniepoint</option>
                                          <option>Kuda</option>
                                       </>
                                    )}
                                    {withdrawData.currency === 'USD' && (
                                       <>
                                          <option>Chase Bank</option>
                                          <option>Bank of America</option>
                                          <option>Wells Fargo</option>
                                          <option>Citibank</option>
                                       </>
                                    )}
                                    {withdrawData.currency === 'GBP' && (
                                       <>
                                          <option>Barclays</option>
                                          <option>HSBC UK</option>
                                          <option>Lloyds Bank</option>
                                          <option>NatWest</option>
                                       </>
                                    )}
                                    {withdrawData.currency === 'EUR' && (
                                       <>
                                          <option>Deutsche Bank</option>
                                          <option>BNP Paribas</option>
                                          <option>Société Générale</option>
                                          <option>Santander</option>
                                       </>
                                    )}
                                    <option value="other">Other / Global Wire</option>
                                 </select>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Account Number / IBAN</label>
                                 <Input
                                    placeholder="Enter full routing/account ID"
                                    className="bg-muted border-border h-14 text-foreground font-bold rounded-xl"
                                    value={withdrawData.accountNumber}
                                    onChange={e => setWithdrawData({...withdrawData, accountNumber: e.target.value})}
                                 />
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Protocol / Network</label>
                                 <select
                                    className="w-full bg-muted border-border h-14 text-foreground font-bold rounded-xl px-4 focus:ring-accent outline-none appearance-none"
                                    value={withdrawData.network}
                                    onChange={e => setWithdrawData({...withdrawData, network: e.target.value})}
                                 >
                                    <option>Ethereum (ERC20)</option>
                                    <option>TRON (TRC20)</option>
                                    <option>Solana (SPL)</option>
                                    <option>BSC (BEP20)</option>
                                    <option>Polygon (POS)</option>
                                    <option>Bitcoin (Native)</option>
                                 </select>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Destination Wallet Address</label>
                                 <Input
                                    placeholder="0x... or Address"
                                    className="bg-muted border-border h-14 text-foreground font-mono text-sm rounded-xl"
                                    value={withdrawData.walletAddress}
                                    onChange={e => setWithdrawData({...withdrawData, walletAddress: e.target.value})}
                                 />
                              </div>
                           </div>
                        )}
                      </div>
                   </Tabs>

                   <div className="flex gap-4 pt-6">
                      <Button variant="ghost" className="flex-1 h-14 text-muted-foreground font-black text-lg rounded-2xl hover:bg-muted" onClick={() => setShowWithdraw(false)}>Cancel</Button>
                      <Button
                         className={`flex-[2] h-14 font-black text-lg rounded-2xl shadow-xl transition-all border-none ${
                            withdrawMethod === 'bank' ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20' : 'bg-accent text-accent-foreground hover:opacity-90 shadow-accent/20'
                         }`}
                         onClick={handleWithdraw}
                      >
                         Authorize Settlement
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

        {/* Funding Modal */}
        {showFund && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-400 to-slate500" />
                <CardHeader className="p-10 pb-4">
                   <CardTitle className="text-3xl font-black text-foreground tracking-tight uppercase">Capital Injection</CardTitle>
                   <p className="text-muted-foreground font-medium mt-1">Upload transfer proof to fund your wallet.</p>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Asset Class</label>
                            <select
                               className="w-full bg-muted border-border h-16 text-foreground font-black rounded-2xl px-4 outline-none"
                               value={fundData.currency}
                               onChange={e => setFundData({...fundData, currency: e.target.value})}
                            >
                               <option value="USD">USD - Dollar</option>
                               <option value="NGN">NGN - Naira</option>
                               <option value="GBP">GBP - Pound</option>
                               <option value="EUR">EUR - Euro</option>
                               <option value="USDT">USDT</option>
                            </select>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Amount</label>
                            <Input
                               type="number"
                               placeholder="0.00"
                               className="bg-muted border-border h-16 text-foreground font-black text-xl rounded-2xl focus:ring-primary"
                               value={fundData.amount}
                               onChange={e => setFundData({...fundData, amount: e.target.value})}
                            />
                            {fundData.amount && fundData.currency !== 'USD' && (
                              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                                Approx. {formatCurrency(convertCurrency(parseFloat(fundData.amount), fundData.currency, 'USD'), 'USD')}
                              </p>
                            )}
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Payment Method</label>
                         <Tabs value={fundData.method} onValueChange={(v: any) => setFundData({...fundData, method: v})} className="w-full">
                            <TabsList className="bg-muted border border-border p-1 rounded-2xl w-full">
                               <TabsTrigger value="bank_transfer" className="flex-1 rounded-xl py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black text-sm">
                                  Bank Transfer
                               </TabsTrigger>
                               <TabsTrigger value="crypto_transfer" className="flex-1 rounded-xl py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-black text-sm">
                                  Crypto Pay
                               </TabsTrigger>
                            </TabsList>
                         </Tabs>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Receipt URL / Link</label>
                         <Input
                            placeholder="Link to payment receipt/screenshot"
                            className="bg-muted border-border h-16 text-foreground font-medium rounded-2xl focus:ring-primary"
                            value={fundData.receiptUrl}
                            onChange={e => setFundData({...fundData, receiptUrl: e.target.value})}
                         />
                         <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Please upload your receipt to a cloud storage and paste the link here.</p>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-6">
                      <Button variant="ghost" className="flex-1 h-14 text-muted-foreground font-black text-lg rounded-2xl hover:bg-muted" onClick={() => setShowFund(false)}>Cancel</Button>
                      <Button
                         className="flex-[2] h-14 bg-primary hover:opacity-90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all border-none"
                         onClick={handleFund}
                      >
                         Submit Proof
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
