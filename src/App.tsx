/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  ShoppingCart, 
  User, 
  Phone, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Eye, 
  EyeOff,
  ChevronLeft,
  BookMarked,
  LayoutDashboard,
  LogOut,
  Clock,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Book {
  id: string;
  title: string;
  price: number;
  batch: number;
}

interface Order {
  id: string;
  studentName: string;
  whatsapp: string;
  deliveryDate: string;
  batch: number;
  books: Book[];
  total: number;
  timestamp: number;
}

// --- Data ---

const BOOKS: Book[] = [
  // Batch 67
  { id: '67-1', title: 'Clinical Anatomy for Medical Students', price: 180, batch: 67 },
  { id: '67-2', title: 'Neuroanatomy Made Simple', price: 160, batch: 67 },
  { id: '67-3', title: 'Basic Ophthalmology Guide', price: 150, batch: 67 },
  { id: '67-4', title: 'Pharmacology Quick Review', price: 170, batch: 67 },
  
  // Batch 68
  { id: '68-1', title: 'Clinical Anatomy for Medical Students', price: 180, batch: 68 },
  { id: '68-2', title: 'Neuroanatomy Made Simple', price: 160, batch: 68 },
  { id: '68-3', title: 'Basic Ophthalmology Guide', price: 150, batch: 68 },
  { id: '68-4', title: 'Pharmacology Quick Review', price: 170, batch: 68 },
];

// --- Components ---

export default function App() {
  const [view, setView] = useState<'booking' | 'admin'>('booking');
  const [studentName, setStudentName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<number>(67);
  const [cart, setCart] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('dr_samir_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('dr_samir_orders', JSON.stringify(newOrders));
  };

  const filteredBooks = useMemo(() => {
    return BOOKS.filter(book => book.batch === selectedBatch);
  }, [selectedBatch]);

  const toggleBookInCart = (book: Book) => {
    if (cart.find(item => item.id === book.id)) {
      setCart(cart.filter(item => item.id !== book.id));
    } else {
      setCart([...cart, book]);
    }
  };

  const totalPrice = cart.reduce((sum, book) => sum + book.price, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('يرجى اختيار كتاب واحد على الأقل');
      return;
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      studentName,
      whatsapp,
      deliveryDate,
      batch: selectedBatch,
      books: [...cart],
      total: totalPrice,
      timestamp: Date.now(),
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    
    // Reset form
    setOrderSuccess(true);
    setCart([]);
    setStudentName('');
    setWhatsapp('');
    setDeliveryDate('');
    
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // Simple password as requested
      setIsAdminAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const deleteOrder = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const updatedOrders = orders.filter(order => order.id !== id);
      saveOrders(updatedOrders);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('booking')}>
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-l from-purple-700 to-purple-500 bg-clip-text text-transparent">
              د. سمير
            </span>
          </div>
          
          <button 
            onClick={() => setView(view === 'booking' ? 'admin' : 'booking')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-purple-50 text-purple-700"
          >
            {view === 'booking' ? (
              <>
                <LayoutDashboard size={18} />
                <span>لوحة الإدارة</span>
              </>
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>العودة للحجز</span>
              </>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'booking' ? (
            <motion.div 
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section with Background Image */}
              <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                  style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                      مكتبة د. سمير <br />
                      <span className="text-purple-300">طريقك للنجاح</span>
                    </h1>
                    <p className="text-lg md:text-xl text-purple-100 max-w-xl font-medium opacity-90">
                      احجز كتبك الجامعية الآن بكل سهولة واحصل عليها في أسرع وقت. نحن هنا لخدمة طلابنا المتميزين.
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form & Selection */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Header */}
                  <section>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">بيانات الحجز</h2>
                    <p className="text-slate-500">يرجى تعبئة البيانات التالية بدقة لضمان وصول طلبك.</p>
                  </section>

                {/* Success Message */}
                {orderSuccess && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center gap-3"
                  >
                    <CheckCircle2 className="text-emerald-500" />
                    <span className="font-medium">تم استلام طلبك بنجاح! سيتم التواصل معك قريباً.</span>
                  </motion.div>
                )}

                {/* Booking Form */}
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <User size={16} className="text-purple-500" />
                          الاسم الكامل للطالب
                        </label>
                        <input 
                          required
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="مثال: محمد أحمد علي"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Phone size={16} className="text-purple-500" />
                          رقم الواتساب
                        </label>
                        <input 
                          required
                          type="tel" 
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="01xxxxxxxxx"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                        />
                      </div>

                      {/* Delivery Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Calendar size={16} className="text-purple-500" />
                          تاريخ الاستلام المفضل
                        </label>
                        <input 
                          required
                          type="date" 
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                        />
                      </div>

                      {/* Batch Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Layers size={16} className="text-purple-500" />
                          اختر الدفعة
                        </label>
                        <div className="flex gap-3">
                          {[67, 68].map((batch) => (
                            <button
                              key={batch}
                              type="button"
                              onClick={() => {
                                setSelectedBatch(batch);
                                setCart([]); // Clear cart when batch changes
                              }}
                              className={`flex-1 py-3 rounded-xl font-bold transition-all border ${
                                selectedBatch === batch 
                                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                              }`}
                            >
                              دفعة {batch}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Selection List */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <BookMarked size={20} className="text-purple-600" />
                      قائمة الكتب المتاحة للدفعة {selectedBatch}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBooks.map((book) => {
                        const isSelected = cart.some(item => item.id === book.id);
                        return (
                          <motion.div
                            key={book.id}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleBookInCart(book)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'border-purple-600 bg-purple-50/50' 
                                : 'border-slate-100 bg-white hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {isSelected ? <Check size={20} /> : <BookOpen size={20} />}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800">{book.title}</h3>
                                <p className="text-sm text-purple-600 font-semibold">{book.price} ج.م</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Cart Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-50 overflow-hidden">
                    <div className="bg-purple-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <ShoppingCart size={20} />
                          سلة الحجز
                        </h2>
                        <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">
                          {cart.length} كتب
                        </span>
                      </div>
                      <p className="text-purple-100 text-sm">راجع طلبك قبل التأكيد</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                        {cart.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <ShoppingCart size={40} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">السلة فارغة حالياً</p>
                          </div>
                        ) : (
                          cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between group">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800">{item.title}</span>
                                <span className="text-xs text-slate-500">{item.price} ج.م</span>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookInCart(item);
                                }}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between text-lg font-black text-slate-900">
                          <span>الإجمالي</span>
                          <span className="text-purple-600">{totalPrice} ج.م</span>
                        </div>

                        <button 
                          onClick={handleSubmitOrder}
                          disabled={cart.length === 0 || !studentName || !whatsapp || !deliveryDate}
                          className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={22} />
                          تأكيد الحجز الآن
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <p className="text-xs text-purple-700 leading-relaxed text-center">
                      * سيتم مراجعة طلبك والتواصل معك عبر الواتساب لتأكيد موعد ومكان الاستلام.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ) : (
            <motion.div 
              key="admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto"
            >
              {!isAdminAuthenticated ? (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-2">منطقة الإدارة</h2>
                  <p className="text-slate-500 text-center mb-8">يرجى إدخال كلمة المرور للوصول للطلبات</p>
                  
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="كلمة المرور"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-500 outline-none pr-12"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    </div>
                    <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">
                      دخول
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-center text-slate-400">تلميح: admin123</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">لوحة التحكم بالطلبات</h2>
                      <p className="text-slate-500">إجمالي الطلبات: {orders.length}</p>
                    </div>
                    <button 
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LogOut size={18} />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-10" />
                        <p>لا توجد طلبات مسجلة حتى الآن</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <motion.div 
                          layout
                          key={order.id}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-200 transition-all"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-900">{order.studentName}</h3>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md">
                                  دفعة {order.batch}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Phone size={14} className="text-emerald-500" />
                                  {order.whatsapp}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} className="text-purple-500" />
                                  {order.deliveryDate}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} className="text-slate-400" />
                                  {new Date(order.timestamp).toLocaleString('ar-EG')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="text-xs text-slate-400">الإجمالي</p>
                                <p className="text-lg font-black text-purple-600">{order.total} ج.م</p>
                              </div>
                              <button 
                                onClick={() => deleteOrder(order.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">الكتب المحجوزة:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.books.map(book => (
                                <span key={book.id} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-100">
                                  {book.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-100 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <BookOpen size={20} />
            <span className="font-bold">د. سمير</span>
          </div>
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة. تم التصميم لخدمة طلابنا الأعزاء.
          </p>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
