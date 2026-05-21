'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft,
  Send, History, Shield, Info, CreditCard,
  ChevronRight, RefreshCw, Lock
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { ELLoader } from '@/components/ui/el-loader'

export default function WalletHub() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferData, setTransferData] = useState({
    recipientSpaceId: '',
    amount: '',
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

  const handleTransfer = async () => {
    if (!transferData.recipientSpaceId || !transferData.amount || !transferData.pin) {
      toast.error('Please fill all transfer fields')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user?.id,
          recipientSpaceId: transferData.recipientSpaceId,
          amount: parseFloat(transferData.amount),
          transactionPin: transferData.pin
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setShowTransfer(false)
        setTransferData({ recipientSpaceId: '', amount: '', pin: '' })
        fetchWalletData()
      } else {
        toast.error(data.error)
      }
    } catch (err) {
      toast.error('Transfer execution error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-cyan-100 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-200">
                    <WalletIcon className="w-8 h-8 text-cyan-400" />
                 </div>
                 The <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Vault</span>
              </h1>
              <p className="text-slate-500 mt-4 text-xl font-medium">Secured liquidity for <span className="text-slate-900 font-black">{user?.full_name}</span></p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <Button onClick={() => setShowTransfer(true)} className="flex-1 md:flex-none h-14 bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 font-black px-8 rounded-2xl shadow-sm transition-all flex items-center gap-2">
                 <Send className="w-5 h-5" /> Transfer
              </Button>
              <Button onClick={() => router.push('/payments')} className="flex-1 md:flex-none h-14 bg-slate-900 hover:bg-cyan-600 text-white font-black px-10 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center gap-2">
                 <CreditCard className="w-5 h-5" /> Load Funds
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Wallet Card */}
           <div className="lg:col-span-5 space-y-8">
              <Card className="bg-slate-900 border-none shadow-2xl shadow-slate-200 rounded-[3rem] overflow-hidden relative min-h-[340px] flex flex-col justify-between">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                 <CardContent className="p-12 relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 mb-4">
                             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Liquid Assets</p>
                          </div>
                          <h2 className="text-7xl font-black text-white tracking-tighter">${wallet?.balance?.toLocaleString() || '0.00'}</h2>
                       </div>
                       <Badge className="bg-white/10 text-white border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest">VERIFIED</Badge>
                    </div>

                    <div className="mt-12 space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Space Identity</p>
                             <p className="font-mono text-cyan-400 font-black text-lg">{user?.el_space_id || 'ID-000000'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Tier</p>
                             <Badge className="bg-cyan-500 text-slate-950 font-black text-[10px] rounded-lg">PLATINUM</Badge>
                          </div>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-full" />
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50">
                 <h3 className="text-slate-900 font-black text-xl mb-6 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    Security Framework
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                             <Lock className="w-5 h-5 text-slate-400" />
                          </div>
                          <span className="text-slate-700 font-bold">Transaction PIN</span>
                       </div>
                       <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[10px]">PROTECTED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                             <RefreshCw className="w-5 h-5 text-slate-400" />
                          </div>
                          <span className="text-slate-700 font-bold">Biometric Auth</span>
                       </div>
                       <Badge className="bg-slate-100 text-slate-400 border-slate-200 font-black text-[10px]">OPTIONAL</Badge>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Transactions */}
           <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    <History className="w-8 h-8 text-slate-300" />
                    Ledger <span className="text-slate-400 font-medium text-lg">/ History</span>
                 </h2>
                 <Button variant="ghost" className="text-slate-500 hover:text-slate-900 font-black h-12 rounded-xl" onClick={fetchWalletData}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync
                 </Button>
              </div>

              <div className="space-y-4">
                 {transactions.length > 0 ? transactions.map((tx) => (
                   <div key={tx.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                            tx.amount > 0 ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                         }`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                         </div>
                         <div>
                            <p className="text-slate-900 font-black text-lg tracking-tight">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <p className="text-slate-400 text-xs font-bold">{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                               <div className="w-1 h-1 rounded-full bg-slate-200" />
                               <p className="text-slate-400 text-xs font-bold">{new Date(tx.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-black text-2xl tracking-tighter ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-900'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                         </p>
                         <div className="flex justify-end mt-1">
                            <Badge className="text-[9px] bg-slate-50 text-slate-500 border-slate-100 px-3 py-0.5 rounded-lg font-black tracking-widest uppercase">{tx.status}</Badge>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-24 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                         <Info className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold text-lg">No transactions recorded yet.</p>
                      <p className="text-slate-400 text-sm mt-1">Your financial history will appear here.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Transfer Modal */}
        {showTransfer && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-lg bg-white border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[3rem] relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <CardHeader className="p-10 pb-0">
                   <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Internal Transfer</CardTitle>
                   <p className="text-slate-500 font-medium">Move assets instantly between EL SPACE identities.</p>
                </CardHeader>
                <CardContent className="p-10 space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Recipient Identity</label>
                      <div className="relative">
                         <Send className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                         <Input
                           placeholder="EL-XXXXXX"
                           className="bg-slate-50 border-slate-100 pl-14 h-16 text-slate-900 font-black text-lg uppercase rounded-2xl focus:ring-cyan-500"
                           value={transferData.recipientSpaceId}
                           onChange={e => setTransferData({...transferData, recipientSpaceId: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Volume ($)</label>
                         <Input
                           type="number"
                           placeholder="0.00"
                           className="bg-slate-50 border-slate-100 h-16 text-slate-900 font-black text-xl rounded-2xl focus:ring-cyan-500"
                           value={transferData.amount}
                           onChange={e => setTransferData({...transferData, amount: e.target.value})}
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Auth PIN</label>
                         <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                              type="password"
                              placeholder="••••"
                              maxLength={4}
                              className="bg-slate-50 border-slate-100 pl-14 h-16 text-slate-900 tracking-[0.5em] text-center font-black text-xl rounded-2xl focus:ring-cyan-500"
                              value={transferData.pin}
                              onChange={e => setTransferData({...transferData, pin: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <Button variant="ghost" className="flex-1 h-16 text-slate-500 font-black text-lg rounded-2xl hover:bg-slate-50" onClick={() => setShowTransfer(false)}>Cancel</Button>
                      <Button className="flex-[2] h-16 bg-slate-900 hover:bg-cyan-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 transition-all" onClick={handleTransfer}>Authorize Settlement</Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </main>
    </div>
  )
}
