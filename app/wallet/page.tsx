'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Download, Send, Wallet, Plus, ArrowUpRight, ArrowDownLeft, Info, Check } from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'
import { BANKS_BY_COUNTRY, SUPPORTED_COUNTRIES, type CountryCode } from '@/lib/banks'
import { CRYPTO_CURRENCIES, WITHDRAWAL_METHODS } from '@/lib/crypto'

interface WalletData {
  balance: number
  pending_balance: number
  total_earned: number
  total_withdrawn: number
  currency: string
  available_for_withdrawal: number
}

interface Transaction {
  id: string
  type: 'earning' | 'withdrawal' | 'refund' | 'fee'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed'
  date: string
}

export default function WalletPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('bank')
  const [fundAmount, setFundAmount] = useState('')
  const [fundDialogOpen, setFundDialogOpen] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  
  // Bank withdrawal state
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('NG')
  const [selectedBank, setSelectedBank] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  
  // Crypto withdrawal state
  const [selectedCrypto, setSelectedCrypto] = useState('USDT')
  const [walletAddress, setWalletAddress] = useState('')
  const [cryptoNetwork, setCryptoNetwork] = useState('ethereum')
  const [userFullName, setUserFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    if (!authLoading) {
      fetchWalletData()
    }
  }, [authLoading, user])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      showLoader(2)
      
      const userId = user?.id || ''
      if (!userId) {
        toast.error('Please log in to view wallet')
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/wallet?userId=${userId}`)
      const data = await response.json()

      if (data.success && data.wallet) {
        setWallet(data.wallet)
      }

      // Fetch real transaction history
      const txResponse = await fetch(`/api/wallet?userId=${userId}&action=transactions`)
      const txData = await txResponse.json()
      
      if (txData.success && txData.transactions) {
        setTransactions(txData.transactions)
      }

      hideLoader()
    } catch (error) {
      console.error('Error fetching wallet:', error)
      toast.error('Failed to load wallet data')
      hideLoader()
    } finally {
      setLoading(false)
    }
  }

  const handleBankWithdrawal = async () => {
    if (!withdrawAmount || !selectedBank || !accountNumber || !accountName) {
      toast.error('Please fill in all bank details')
      return
    }

    if (parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (wallet?.available_for_withdrawal || 0)) {
      toast.error('Invalid withdrawal amount')
      return
    }

    try {
      showLoader(3)
      const userId = user?.id || ''

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'withdraw',
          userId,
          amount: parseFloat(withdrawAmount),
          method: 'bank',
          accountDetails: {
            country: selectedCountry,
            bank_code: selectedBank,
            account_number: accountNumber,
            account_name: accountName,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Bank withdrawal request submitted!')
        // Reset form
        setWithdrawAmount('')
        setSelectedBank('')
        setAccountNumber('')
        setAccountName('')
        setWithdrawDialogOpen(false)
        fetchWalletData()
      } else {
        toast.error(data.error || 'Withdrawal failed')
      }
      hideLoader()
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast.error('Withdrawal error')
      hideLoader()
    }
  }

  const handleCryptoWithdrawal = async () => {
    if (!withdrawAmount || !walletAddress || !selectedCrypto) {
      toast.error('Please fill in all crypto details')
      return
    }

    if (parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (wallet?.available_for_withdrawal || 0)) {
      toast.error('Invalid withdrawal amount')
      return
    }

    try {
      showLoader(3)
      const userId = user?.id || ''

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'withdraw',
          userId,
          amount: parseFloat(withdrawAmount),
          method: 'crypto',
          accountDetails: {
            crypto_type: selectedCrypto,
            network: cryptoNetwork,
            wallet_address: walletAddress,
            full_name: userFullName,
            email: userEmail,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Crypto withdrawal request submitted! Processing may take 5-30 minutes.')
        // Reset form
        setWithdrawAmount('')
        setWalletAddress('')
        setUserFullName('')
        setUserEmail('')
        setWithdrawDialogOpen(false)
        fetchWalletData()
      } else {
        toast.error(data.error || 'Withdrawal failed')
      }
      hideLoader()
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast.error('Withdrawal error')
      hideLoader()
    }
  }

  const handleFunding = async () => {
    if (!fundAmount) {
      toast.error('Please enter amount')
      return
    }

    if (parseFloat(fundAmount) < 1) {
      toast.error('Minimum funding amount is $1')
      return
    }

    // Redirect to the provided checkout URL as instructed
    const checkoutUrl = 'https://checkout.korapay.com/pay/VZBklOmLoiuRiu3'
    toast.success('Redirecting to Korapay Checkout...')
    setTimeout(() => {
      window.location.href = checkoutUrl
    }, 1500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Wallet className="w-12 h-12 mx-auto mb-4 animate-bounce" />
          <p>Loading wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Wallet className="w-10 h-10 text-blue-400" />
            Your Wallet
          </h1>
          <p className="text-blue-200">Manage your earnings, funds, and withdrawals</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all">
            <p className="text-slate-400 text-sm font-medium">Available Balance</p>
            <div className="text-3xl font-bold text-white mt-2">
              ${(wallet?.available_for_withdrawal || 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Ready to withdraw</p>
          </div>

          <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-6 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all">
            <p className="text-slate-400 text-sm font-medium">Pending Balance</p>
            <div className="text-3xl font-bold text-yellow-400 mt-2">
              ${(wallet?.pending_balance || 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Awaiting release</p>
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
            <p className="text-slate-400 text-sm font-medium">Total Earned</p>
            <div className="text-3xl font-bold text-emerald-400 mt-2">
              ${(wallet?.total_earned || 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-2">All time</p>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all">
            <p className="text-slate-400 text-sm font-medium">Total Withdrawn</p>
            <div className="text-3xl font-bold text-purple-400 mt-2">
              ${(wallet?.total_withdrawn || 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-2">Withdrawn to account</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2 font-semibold py-2">
                <Plus className="w-4 h-4" />
                Fund Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-blue-500/20 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Fund Your Wallet</DialogTitle>
                <DialogDescription className="text-blue-200">
                  Add funds to your wallet securely via Korapay
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Instructions */}
                <Card className="bg-blue-900/30 border-blue-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-blue-200 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Checkout Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-300 space-y-2">
                    <div className="flex gap-2 font-bold text-white mb-2">
                      IMPORTANT: Follow these steps exactly
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-400 min-w-6">1.</span>
                      <span>Enter the amount you want to fund below (e.g., 50.00)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-400 min-w-6">2.</span>
                      <span>On the checkout page, enter your <strong>Full Name</strong> and <strong>Email Address</strong> exactly as used in this app.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-400 min-w-6">3.</span>
                      <span>Enter the <strong>EXACT same amount</strong> on the checkout page as you entered here.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-400 min-w-6">4.</span>
                      <span>Complete the payment to have your wallet funded automatically.</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Amount Input */}
                <div>
                  <Label htmlFor="fund-amount" className="text-white">Amount (USD)</Label>
                  <Input
                    id="fund-amount"
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Enter amount in USD"
                    min="1"
                    step="0.01"
                    className="bg-slate-700 border-blue-500/20 text-white mt-2"
                  />
                  <p className="text-xs text-blue-300 mt-1">Minimum: $1.00</p>
                </div>

                {/* User Info Display */}
                <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-500/10">
                  <p className="text-sm text-blue-200 mb-2">Checkout Details (Pre-filled):</p>
                  <div className="space-y-1 text-xs text-blue-300">
                    <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
                    <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
                  </div>
                </div>

                <Button
                  onClick={handleFunding}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue to Korapay Checkout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 gap-2"
                disabled={!wallet || wallet.available_for_withdrawal <= 0}
              >
                <ArrowUpRight className="w-4 h-4" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-blue-500/20 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Withdraw Funds</DialogTitle>
                <DialogDescription className="text-blue-200">
                  Withdraw your available balance
                </DialogDescription>
              </DialogHeader>

              <Tabs value={withdrawMethod} onValueChange={setWithdrawMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="bank" className="text-blue-200">Bank Transfer</TabsTrigger>
                  <TabsTrigger value="crypto" className="text-blue-200">Cryptocurrency</TabsTrigger>
                </TabsList>

                {/* Bank Transfer Tab */}
                <TabsContent value="bank" className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount" className="text-white">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={`Max: $${wallet?.available_for_withdrawal.toFixed(2)}`}
                      min="0"
                      max={wallet?.available_for_withdrawal}
                      step="0.01"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                    <p className="text-xs text-blue-300 mt-1">Available: ${(wallet?.available_for_withdrawal || 0).toFixed(2)}</p>
                  </div>

                  <div>
                    <Label htmlFor="country-select" className="text-white">Country</Label>
                    <Select value={selectedCountry} onValueChange={(v) => {
                      setSelectedCountry(v as CountryCode)
                      setSelectedBank('')
                    }}>
                      <SelectTrigger className="bg-slate-700 border-blue-500/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-500/20">
                        {SUPPORTED_COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bank-select" className="text-white">Bank</Label>
                    <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="bg-slate-700 border-blue-500/20 text-white mt-2">
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-500/20 max-h-60">
                        {selectedCountry && BANKS_BY_COUNTRY[selectedCountry]?.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.name} ({bank.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="account-name" className="text-white">Account Name</Label>
                    <Input
                      id="account-name"
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Enter account holder name"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="account-number" className="text-white">Account Number</Label>
                    <Input
                      id="account-number"
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleBankWithdrawal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirm Bank Withdrawal
                  </Button>
                </TabsContent>

                {/* Crypto Tab */}
                <TabsContent value="crypto" className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount-crypto" className="text-white">Amount</Label>
                    <Input
                      id="withdraw-amount-crypto"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder={`Max: $${wallet?.available_for_withdrawal.toFixed(2)}`}
                      min="0"
                      max={wallet?.available_for_withdrawal}
                      step="0.01"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                    <p className="text-xs text-blue-300 mt-1">Available: ${(wallet?.available_for_withdrawal || 0).toFixed(2)}</p>
                  </div>

                  <div>
                    <Label htmlFor="crypto-select" className="text-white">Cryptocurrency</Label>
                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      <SelectTrigger className="bg-slate-700 border-blue-500/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-500/20">
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                        <SelectItem value="ZEC">Zcash (ZEC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="network-select" className="text-white">Network</Label>
                    <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
                      <SelectTrigger className="bg-slate-700 border-blue-500/20 text-white mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-blue-500/20">
                        <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                        <SelectItem value="polygon">Polygon (MATIC)</SelectItem>
                        <SelectItem value="bsc">Binance Smart Chain (BSC)</SelectItem>
                        <SelectItem value="solana">Solana (SOL)</SelectItem>
                        <SelectItem value="zcash">Zcash (ZEC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wallet-address" className="text-white">Crypto Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                    <p className="text-xs text-blue-300 mt-1">Double-check the address - incorrect addresses cannot be reversed</p>
                  </div>

                  <div>
                    <Label htmlFor="full-name" className="text-white">Full Name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      value={userFullName}
                      onChange={(e) => setUserFullName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-crypto" className="text-white">Email Address</Label>
                    <Input
                      id="email-crypto"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Your email address"
                      className="bg-slate-700 border-blue-500/20 text-white mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleCryptoWithdrawal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirm Crypto Withdrawal
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Transactions Table */}
        <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Transaction History</CardTitle>
            <CardDescription className="text-blue-300">
              Your recent wallet transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        {tx.type === 'earning' && (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        )}
                        {tx.type === 'withdrawal' && (
                          <ArrowUpRight className="w-5 h-5 text-blue-400" />
                        )}
                        {tx.type === 'refund' && (
                          <Send className="w-5 h-5 text-orange-400" />
                        )}
                        {tx.type === 'fee' && (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{tx.description}</p>
                        <p className="text-sm text-blue-300">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.type === 'earning' ? 'text-green-400' :
                        tx.type === 'withdrawal' ? 'text-blue-400' : 'text-red-400'
                      }`}>
                        {tx.type === 'earning' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-1 ${
                          tx.status === 'completed'
                            ? 'border-green-500/50 text-green-300'
                            : tx.status === 'pending'
                            ? 'border-yellow-500/50 text-yellow-300'
                            : 'border-red-500/50 text-red-300'
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-blue-300">
                  <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
