import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Store, TrendingUp, Wallet, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { apiClient } from '@/services/api';

function BecomeSellerPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    shopAddress: '',
    shopDescription: ''
  });

  const handleStartRegister = () => {
    if (!user) {
      showToast({ type: 'error', title: 'Cần đăng nhập', message: 'Vui lòng đăng nhập để đăng ký trở thành Người bán' });
      navigate({ to: '/auth/login', search: { redirect: '/become-seller' } });
      return;
    }

    if (user.role === 'seller' || user.role === 'admin') {
      showToast({ type: 'success', title: 'Đã là Seller', message: 'Tài khoản của bạn đã có quyền Người bán' });
      navigate({ to: '/sell' });
      return;
    }
    
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await apiClient.post('/users/seller-register', formData);
      
      if (res.success) {
        if (user) {
          updateUser({ ...user, sellerStatus: 'pending', shopName: formData.shopName });
        }
        showToast({ type: 'success', title: 'Thành công', message: 'Đã gửi đơn đăng ký. Vui lòng chờ Admin duyệt.' });
        setShowForm(false);
      } else {
        showToast({ type: 'error', title: 'Lỗi', message: res.message || 'Đã có lỗi xảy ra' });
      }
    } catch (error: any) {
      showToast({ type: 'error', title: 'Lỗi', message: error.response?.data?.message || 'Không thể kết nối đến máy chủ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight">
            Trở thành Người bán Zopee ngay hôm nay
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-blue-100">
            Tiếp cận hàng triệu khách hàng tiềm năng, công cụ quản lý bán hàng chuyên nghiệp và hỗ trợ rút tiền nhanh chóng qua VietQR.
          </p>
          <div className="mt-10">
            {user?.sellerStatus === 'pending' ? (
              <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-100 p-6 rounded-xl flex items-center justify-center gap-3">
                <Clock className="w-6 h-6" />
                <span className="text-xl font-medium">Đơn đăng ký của bạn đang được Admin chờ duyệt</span>
              </div>
            ) : user?.sellerStatus === 'rejected' ? (
              <div className="bg-red-500/20 border border-red-400 text-red-100 p-6 rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="text-xl font-medium">Đơn đăng ký của bạn đã bị từ chối</span>
                <Button variant="outline" onClick={handleStartRegister} className="mt-2 text-black">Đăng ký lại</Button>
              </div>
            ) : (
              !showForm && (
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg font-bold"
                  onClick={handleStartRegister}
                >
                  Đăng ký ngay
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="max-w-2xl mx-auto px-4 mt-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Thông tin Cửa hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Tên Cửa hàng (*)</Label>
                <Input 
                  id="shopName" 
                  value={formData.shopName}
                  onChange={e => setFormData({...formData, shopName: e.target.value})}
                  required
                  placeholder="Ví dụ: Zopee Official Store" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopAddress">Địa chỉ lấy hàng (*)</Label>
                <Input 
                  id="shopAddress" 
                  value={formData.shopAddress}
                  onChange={e => setFormData({...formData, shopAddress: e.target.value})}
                  required
                  placeholder="Ví dụ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopDescription">Mô tả thêm (Tùy chọn)</Label>
                <Textarea 
                  id="shopDescription" 
                  value={formData.shopDescription}
                  onChange={e => setFormData({...formData, shopDescription: e.target.value})}
                  placeholder="Thông tin giới thiệu cửa hàng của bạn" 
                />
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Đang gửi...' : 'Gửi đơn đăng ký'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Tại sao nên bán hàng trên Zopee?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tăng trưởng doanh thu</h3>
            <p className="text-gray-600">
              Nền tảng của chúng tôi có lượng truy cập khổng lồ mỗi ngày. Thuật toán tìm kiếm thông minh giúp sản phẩm của bạn dễ dàng tiếp cận đúng khách hàng mục tiêu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <Store size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý dễ dàng</h3>
            <p className="text-gray-600">
              Cung cấp bộ công cụ Seller Center (Trung tâm người bán) toàn diện: từ đăng sản phẩm, quản lý kho hàng, đến theo dõi đơn hàng thời gian thực.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-6">
              <Wallet size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Rút tiền siêu tốc VietQR</h3>
            <p className="text-gray-600">
              Doanh thu được cộng ngay vào Ví Người Bán. Hỗ trợ hệ thống rút tiền 24/7 về mọi ngân hàng tại Việt Nam hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quy trình đơn giản</h2>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-4 flex-shrink-0" size={28} />
              <div>
                <h4 className="text-lg font-bold text-gray-900">1. Click nâng cấp tài khoản</h4>
                <p className="text-gray-600">Bạn chỉ cần bấm nút Đăng ký ở trên. Hệ thống sẽ tự động cấp quyền Seller cho tài khoản hiện tại của bạn.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-4 flex-shrink-0" size={28} />
              <div>
                <h4 className="text-lg font-bold text-gray-900">2. Truy cập Kênh Người Bán (Seller Center)</h4>
                <p className="text-gray-600">Tại đây, bạn sẽ được hướng dẫn tạo cửa hàng, điền thông tin và bắt đầu đăng bán những sản phẩm đầu tiên.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckCircle2 className="text-green-500 mr-4 flex-shrink-0" size={28} />
              <div>
                <h4 className="text-lg font-bold text-gray-900">3. Nhận đơn hàng và giao hàng</h4>
                <p className="text-gray-600">Zopee hỗ trợ toàn bộ hệ thống xử lý thanh toán. Việc của bạn chỉ là đóng gói và giao hàng đúng hẹn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/become-seller')({
  component: BecomeSellerPage,
});
