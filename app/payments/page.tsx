'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Download, DollarSign, ArrowUpRight, ArrowDownLeft, Calendar, Eye } from 'lucide-react'
import { useLoader } from '@/components/loader-provider'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Payment {
  id: string
  transactionId: string
  type: 'income' | 'expense' | 'fee' | 'refund'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  description: string
  projectName: string
  relatedPerson: string
  date: string
  method?: string
  invoiceUrl?: string
}

interface PaymentStats {
  totalIncome: number
  totalExpenses: number
  totalFees: number
  totalRefunds: number
  averageTransaction: number
}

export default function PaymentsPage() {
  const { user, loading: authLoading } = useAuth()
  const { show: showLoader, hide: hideLoader } = useLoader()
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats>({
    totalIncome: 0,
    totalExpenses: 0,
    totalFees: 0,
    totalRefunds: 0,
    averageTransaction: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!authLoading) {
      fetchPayments()
    }
  }, [authLoading, user])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      showLoader(2)
      const userId = user?.id || ''
      if (!userId) return

      const response = await fetch(`/api/payments?userId=${userId}&action=history`)
      const data = await response.json()

      if (data.success && data.payments) {
        setPayments(data.payments)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setPayments([])
        setStats({
          totalIncome: 0,
          totalExpenses: 0,
          totalFees: 0,
          totalRefunds: 0,
          averageTransaction: 0,
        })
      }
      hideLoader()
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Failed to load payments')
      hideLoader()
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const typeMatch = filterType === 'all' || payment.type === filterType
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus
    const searchMatch = searchQuery === '' ||
      payment.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.relatedPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
    return typeMatch && statusMatch && searchMatch
  })

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'expense':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'fee':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'refund':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'refunded':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      default:
        return 'bg-slate-500/20 text-slate-300'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <CreditCard className="w-12 h-12 mx-auto mb-4 animate-bounce" />
          <p>Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <CreditCard className="w-10 h-10 text-emerald-400" />
            Payment History
          </h1>
          <p className="text-emerald-200">Track all your financial transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-200">Total Income</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                ${stats.totalIncome.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-200">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400 mt-1">
                ${stats.totalExpenses.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-200">Total Fees</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                ${stats.totalFees.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-200">Refunds</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                ${stats.totalRefunds.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-200">Avg Transaction</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                ${stats.averageTransaction.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="bg-slate-800/50 border-emerald-500/20 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by project, person, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700 border-emerald-500/20 text-white"
              />

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-700 border-emerald-500/20 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-emerald-500/20">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-700 border-emerald-500/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-emerald-500/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-slate-800/50 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-white">Transactions</CardTitle>
            <CardDescription className="text-emerald-300">
              {filteredPayments.length} transaction(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 bg-slate-700/50 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          payment.type === 'income' ? 'bg-green-500/20' :
                          payment.type === 'expense' ? 'bg-red-500/20' :
                          payment.type === 'fee' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                        }`}>
                          {payment.type === 'income' || payment.type === 'refund' ? (
                            <ArrowDownLeft className={`w-5 h-5 ${
                              payment.type === 'income' ? 'text-green-400' : 'text-blue-400'
                            }`} />
                          ) : (
                            <ArrowUpRight className={`w-5 h-5 ${
                              payment.type === 'expense' ? 'text-red-400' : 'text-orange-400'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{payment.description}</p>
                          <p className="text-sm text-slate-400">
                            {payment.projectName} • {payment.relatedPerson}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          payment.type === 'income' || payment.type === 'refund'
                            ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {payment.type === 'income' || payment.type === 'refund' ? '+' : '-'}
                          ${payment.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${getPaymentTypeColor(payment.type)}`}>
                        {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600/50 text-slate-400 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(payment.date).toLocaleDateString()}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600/50 text-slate-400 text-xs">
                        ID: {payment.transactionId}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No payments found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
            <DialogContent className="bg-slate-800 border-emerald-500/20">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Transaction Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/50 rounded-lg border border-emerald-500/10">
                  <div>
                    <p className="text-xs text-slate-400">Transaction ID</p>
                    <p className="text-white font-mono mt-1">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Amount</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">
                      ${selectedPayment.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Type</p>
                    <Badge className={`mt-1 ${getPaymentTypeColor(selectedPayment.type)}`}>
                      {selectedPayment.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <Badge className={`mt-1 ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-white mt-1">
                      {new Date(selectedPayment.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Method</p>
                    <p className="text-white mt-1">{selectedPayment.method || 'N/A'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg border border-emerald-500/10">
                  <p className="text-sm text-slate-400 mb-2">Description</p>
                  <p className="text-white">{selectedPayment.description}</p>
                </div>

                <div className="p-4 bg-slate-700/50 rounded-lg border border-emerald-500/10">
                  <p className="text-sm text-slate-400 mb-2">Project & Related</p>
                  <p className="text-white">Project: {selectedPayment.projectName}</p>
                  <p className="text-white">Related: {selectedPayment.relatedPerson}</p>
                </div>

                {selectedPayment.invoiceUrl && (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
