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

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><ELLoader /></div>

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <main className="max-w-6xl mx-auto p-8 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div>
              <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                 <WalletIcon className="w-10 h-10 text-cyan-400" />
                 EL Digital Wallet
              </h1>
              <p className="text-slate-400 mt-2 font-medium">Unified Treasury for <span className="text-white">{user?.full_name}</span></p>
           </div>
           <div className="flex gap-3">
              <Button onClick={() => setShowTransfer(true)} className="bg-white text-slate-950 hover:bg-cyan-400 hover:text-white font-bold px-8 h-12 rounded-xl transition-all">
                 <Send className="w-4 h-4 mr-2" /> Internal Transfer
              </Button>
              <Button onClick={() => router.push('/payments')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 h-12 rounded-xl">
                 <CreditCard className="w-4 h-4 mr-2" /> Top Up
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Wallet Card */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="bg-gradient-to-br from-cyan-600 to-blue-700 border-none shadow-2xl shadow-cyan-500/20 rounded-[2rem] overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-20">
                    <WalletIcon className="w-32 h-32" />
                 </div>
                 <CardContent className="p-10 relative z-10 space-y-10">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-cyan-100 text-[10px] font-black uppercase tracking-widest mb-1">Available Balance</p>
                          <h2 className="text-5xl font-black text-white">${wallet?.balance?.toLocaleString() || '0.00'}</h2>
                       </div>
                       <Badge className="bg-white/20 text-white border-none backdrop-blur-md">ACTIVE</Badge>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between text-cyan-100 text-xs">
                          <span>User ID: <span className="font-mono text-white ml-2">{user?.el_space_id}</span></span>
                          <span className="font-bold">EL ACCESS PREMIUM</span>
                       </div>
                       <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-2/3" />
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-white/5 p-6 rounded-2xl">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Security Center
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                       <span className="text-slate-400 text-sm">Transaction PIN</span>
                       <Badge className="bg-emerald-500/10 text-emerald-400 border-none">ENABLED</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                       <span className="text-slate-400 text-sm">2FA Verification</span>
                       <Badge className="bg-emerald-500/10 text-emerald-400 border-none">ACTIVE</Badge>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Transactions */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <History className="w-6 h-6 text-slate-500" />
                    Transaction Audit
                 </h2>
                 <Button variant="ghost" className="text-cyan-400 hover:text-white" onClick={fetchWalletData}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                 </Button>
              </div>

              <div className="space-y-3">
                 {transactions.length > 0 ? transactions.map((tx) => (
                   <div key={tx.id} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:bg-white/[0.02] transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-xl ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="text-white font-bold">{tx.description}</p>
                            <p className="text-slate-500 text-xs">{new Date(tx.date).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`font-black text-lg ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                         </p>
                         <Badge className="text-[9px] bg-white/5 text-slate-400 border-none px-2 uppercase">{tx.status}</Badge>
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                      <p className="text-slate-500">Your ledger is currently empty.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Transfer Modal */}
        {showTransfer && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
             <Card className="w-full max-w-md bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
                <CardHeader>
                   <CardTitle className="text-white">Internal Asset Transfer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Space ID</label>
                      <div className="relative">
                         <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <Input
                           placeholder="EL-12345678"
                           className="bg-white/5 border-white/5 pl-10 h-12 text-white font-mono uppercase"
                           value={transferData.recipientSpaceId}
                           onChange={e => setTransferData({...transferData, recipientSpaceId: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount ($)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-white/5 border-white/5 h-12 text-white font-bold"
                        value={transferData.amount}
                        onChange={e => setTransferData({...transferData, amount: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transaction PIN</label>
                      <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <Input
                           type="password"
                           placeholder="••••"
                           maxLength={4}
                           className="bg-white/5 border-white/5 pl-10 h-12 text-white tracking-[0.5em] text-center font-black"
                           value={transferData.pin}
                           onChange={e => setTransferData({...transferData, pin: e.target.value})}
                         />
                      </div>
                   </div>
                   <div className="flex gap-3 pt-4">
                      <Button variant="ghost" className="flex-1 text-slate-400" onClick={() => setShowTransfer(false)}>Cancel</Button>
                      <Button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold" onClick={handleTransfer}>Authorize Transfer</Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </main>
    </div>
  )
}
