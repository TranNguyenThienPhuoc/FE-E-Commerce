import { createFileRoute } from '@tanstack/react-router';
import { ShoppingBag, Users, ShieldCheck, Zap } from 'lucide-react';

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Về Zopee</h1>
        <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
          Zopee là nền tảng thương mại điện tử thế hệ mới, nơi kết nối hàng triệu người mua và người bán một cách an toàn, nhanh chóng và hiệu quả.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Đa dạng sản phẩm</h3>
          <p className="text-gray-500 text-sm">Hàng triệu mặt hàng từ các thương hiệu uy tín và nhà bán hàng chất lượng.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cộng đồng lớn mạnh</h3>
          <p className="text-gray-500 text-sm">Kết nối người mua và người bán trong một hệ sinh thái thương mại năng động.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">An toàn tuyệt đối</h3>
          <p className="text-gray-500 text-sm">Thanh toán bảo mật, chính sách đổi trả minh bạch bảo vệ quyền lợi người tiêu dùng.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Giao hàng siêu tốc</h3>
          <p className="text-gray-500 text-sm">Mạng lưới vận chuyển rộng khắp đảm bảo hàng hóa đến tay bạn nhanh nhất.</p>
        </div>
      </div>

      <div className="mt-20 bg-blue-50 rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tầm nhìn của chúng tôi</h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Trở thành điểm đến mua sắm trực tuyến số 1 tại Việt Nam và vươn tầm khu vực. Chúng tôi không ngừng đổi mới công nghệ để mang lại trải nghiệm mua bán liền mạch, đồng thời tạo ra cơ hội phát triển kinh doanh công bằng cho mọi nhà bán hàng nhỏ lẻ.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/about')({
  component: AboutPage,
});
