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

export default function WalletHub() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])

  // Withdrawal State
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'crypto'>('bank')
  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    accountNumber: '',
    bankName: '',
    walletAddress: '',
    network: 'Ethereum (ERC20)',
    pin: ''
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
          method: withdrawMethod,
          accountDetails: withdrawMethod === 'bank' ? {
            accountNumber: withdrawData.accountNumber,
            bankName: withdrawData.bankName
          } : {
            address: withdrawData.walletAddress,
            network: withdrawData.network
          },
          metadata: { pin: withdrawData.pin }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Withdrawal request initiated!')
        setShowWithdraw(false)
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

  if (loading && !wallet) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>

  return (
    <DashboardLayout userType={user?.user_type || 'freelancer'}>
      <div className="min-h-screen text-slate-200 pb-20">
        <main className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                  <WalletIcon className="w-7 h-7 text-white" />
                </div>
                The <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vault</span>
              </h1>
              <p className="text-slate-400 mt-2 text-lg font-medium">Secured liquidity & asset management</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button onClick={() => setShowWithdraw(true)} className="flex-1 md:flex-none h-14 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-black px-8 rounded-2xl transition-all">
                <ArrowUpRight className="w-5 h-5 mr-2" /> Withdraw
              </Button>
              <Button onClick={() => router.push('/payments')} className="flex-1 md:flex-none h-14 bg-cyan-500 hover:bg-cyan-600 text-white font-black px-10 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all">
                <Plus className="w-5 h-5 mr-2" /> Fund Wallet
              </Button>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/20 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Liquid Balance</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter">${wallet?.balance?.toLocaleString() || '0.00'}</h2>
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Available for Instant Pay</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Escrow / Pending</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter">${wallet?.pending_balance?.toLocaleString() || '0.00'}</h2>
                <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest">Protected by Platform Escrow</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-all" />
              <CardContent className="p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lifetime Yield</span>
                </div>
                <h2 className="text-6xl font-black text-white tracking-tighter">${wallet?.total_earned?.toLocaleString() || '0.00'}</h2>
                <p className="mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest">Total ecosystem earnings</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Ledger */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                  <History className="w-8 h-8 text-slate-700" />
                  Ledger <span className="text-slate-500 font-medium text-lg">/ Operations</span>
                </h2>
                <Button variant="ghost" className="text-slate-500 hover:text-white font-black h-12 rounded-xl" onClick={fetchWalletData}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Sync
                </Button>
              </div>

              <div className="space-y-4">
                 {transactions.length > 0 ? transactions.map((tx) => (
                   <div key={tx.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:border-slate-700 hover:bg-slate-800/50 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                            tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-white group-hover:text-slate-950'
                         }`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                         </div>
                         <div>
                            <p className="text-white font-black text-lg tracking-tight">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                               <div className="w-1 h-1 rounded-full bg-slate-800" />
                               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{tx.type}</p>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-black text-2xl tracking-tighter ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                         </p>
                         <div className="flex justify-end mt-1">
                            <Badge className={`text-[9px] border-none px-3 py-0.5 rounded-lg font-black tracking-widest uppercase ${
                              tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>{tx.status}</Badge>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem]">
                      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-800">
                         <Info className="w-8 h-8 text-slate-700" />
                      </div>
                      <p className="text-slate-500 font-bold text-lg">No operations recorded yet.</p>
                      <p className="text-slate-600 text-sm mt-1">Your ledger will populate as you scale.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Security & ID */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="bg-slate-900 border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                 <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3 relative z-10">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    Security Framework
                 </h3>
                 <div className="space-y-4 relative z-10">
                    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 flex justify-between items-center">
                       <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Space Identity</p>
                          <p className="font-mono text-cyan-400 font-black text-lg">{user?.el_space_id}</p>
                       </div>
                       <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-slate-500" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-sm">
                             <Lock className="w-5 h-5 text-slate-500" />
                          </div>
                          <span className="text-slate-300 font-bold">Transaction PIN</span>
                       </div>
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px]">ACTIVE</Badge>
                    </div>
                 </div>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-none p-8 rounded-[2.5rem] text-white">
                 <h3 className="font-black text-xl mb-4">Elite Benefits</h3>
                 <p className="text-white/80 font-medium mb-6">You're currently in the <span className="text-white font-black">Platinum Tier</span> with 0.5% reduced fees.</p>
                 <Button className="w-full bg-white text-slate-950 hover:bg-white/90 font-black rounded-xl h-12">Upgrade Pipeline</Button>
              </Card>
            </div>
          </div>
        </main>

        {/* Withdrawal Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500" />
                <CardHeader className="p-10 pb-4">
                   <CardTitle className="text-3xl font-black text-white tracking-tight">Capital Withdrawal</CardTitle>
                   <p className="text-slate-500 font-medium mt-1">Select your preferred liquidity destination.</p>
                </CardHeader>
                <CardContent className="p-10 pt-0 space-y-8">
                   <Tabs value={withdrawMethod} onValueChange={(v: any) => setWithdrawMethod(v)} className="w-full">
                      <TabsList className="bg-slate-800 border border-slate-700 p-1 rounded-2xl w-full mb-8">
                         <TabsTrigger value="bank" className="flex-1 rounded-xl py-3 data-[state=active]:bg-cyan-500 data-[state=active]:text-white font-black text-sm">
                            <Building className="w-4 h-4 mr-2" /> Bank Settlement
                         </TabsTrigger>
                         <TabsTrigger value="crypto" className="flex-1 rounded-xl py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white font-black text-sm">
                            <Globe className="w-4 h-4 mr-2" /> Crypto Protocol
                         </TabsTrigger>
                      </TabsList>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Withdrawal Volume ($)</label>
                              <Input
                                 type="number"
                                 placeholder="0.00"
                                 className="bg-slate-800 border-slate-700 h-16 text-white font-black text-xl rounded-2xl focus:ring-cyan-500"
                                 value={withdrawData.amount}
                                 onChange={e => setWithdrawData({...withdrawData, amount: e.target.value})}
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auth PIN</label>
                              <div className="relative">
                                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                 <Input
                                    type="password"
                                    placeholder="••••"
                                    maxLength={4}
                                    className="bg-slate-800 border-slate-700 pl-14 h-16 text-white tracking-[0.5em] text-center font-black text-xl rounded-2xl focus:ring-cyan-500"
                                    value={withdrawData.pin}
                                    onChange={e => setWithdrawData({...withdrawData, pin: e.target.value})}
                                 />
                              </div>
                           </div>
                        </div>

                        {withdrawMethod === 'bank' ? (
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institution Name</label>
                                 <Input
                                    placeholder="e.g. GTBank, Chase, HSBC"
                                    className="bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl"
                                    value={withdrawData.bankName}
                                    onChange={e => setWithdrawData({...withdrawData, bankName: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Number / IBAN</label>
                                 <Input
                                    placeholder="Enter full routing/account ID"
                                    className="bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl"
                                    value={withdrawData.accountNumber}
                                    onChange={e => setWithdrawData({...withdrawData, accountNumber: e.target.value})}
                                 />
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol / Network</label>
                                 <select
                                    className="w-full bg-slate-800 border-slate-700 h-14 text-white font-bold rounded-xl px-4 focus:ring-purple-500 outline-none appearance-none"
                                    value={withdrawData.network}
                                    onChange={e => setWithdrawData({...withdrawData, network: e.target.value})}
                                 >
                                    <option>Ethereum (ERC20)</option>
                                    <option>Polygon (POS)</option>
                                    <option>Solana (SPL)</option>
                                    <option>Bitcoin (Native)</option>
                                    <option>TRON (TRC20)</option>
                                 </select>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination Wallet Address</label>
                                 <Input
                                    placeholder="0x... or Address"
                                    className="bg-slate-800 border-slate-700 h-14 text-white font-mono text-sm rounded-xl"
                                    value={withdrawData.walletAddress}
                                    onChange={e => setWithdrawData({...withdrawData, walletAddress: e.target.value})}
                                 />
                              </div>
                           </div>
                        )}
                      </div>
                   </Tabs>

                   <div className="flex gap-4 pt-6">
                      <Button variant="ghost" className="flex-1 h-14 text-slate-500 font-black text-lg rounded-2xl hover:bg-slate-800" onClick={() => setShowWithdraw(false)}>Cancel</Button>
                      <Button
                         className={`flex-[2] h-14 text-white font-black text-lg rounded-2xl shadow-xl transition-all ${
                            withdrawMethod === 'bank' ? 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20' : 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/20'
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
      </div>
    </DashboardLayout>
  )
}
