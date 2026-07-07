import { createFileRoute } from '@tanstack/react-router';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

import { supportService } from '@/services/support.service';

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const email = (form.elements.namedItem('email') as HTMLInputElement).value;
      // Default to "Liên hệ hỗ trợ" if subject is not provided in UI, though I will add subject field
      const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
      const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

      await supportService.createTicket({
        customerName: name,
        customerEmail: email,
        subject,
        message,
      });

      showToast({ variant: 'success', title: 'Gửi tin nhắn thành công', description: 'Chúng tôi sẽ phản hồi bạn sớm nhất có thể!' });
      form.reset();
    } catch (error) {
      showToast({ variant: 'error', title: 'Gửi tin nhắn thất bại', description: 'Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Liên hệ Zopee</h1>
        <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại lời nhắn hoặc liên hệ trực tiếp qua các kênh dưới đây.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin liên hệ</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <MapPin size={20} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Trụ sở chính</h3>
                <p className="mt-1 text-gray-500">
                  123 Đường Nguyễn Huệ, Quận 1<br />
                  Thành phố Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Phone size={20} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Điện thoại hỗ trợ</h3>
                <p className="mt-1 text-gray-500">
                  0869759763<br />
                  Thứ 2 - Chủ Nhật (8:00 - 22:00)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Mail size={20} />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                <p className="mt-1 text-gray-500">
                  tranp13579@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Gửi lời nhắn</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <Input id="name" name="name" required placeholder="Nhập họ và tên của bạn" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input id="email" name="email" type="email" required placeholder="Địa chỉ email của bạn" />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <Input id="subject" name="subject" required placeholder="Tiêu đề cần hỗ trợ" />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <Textarea id="message" name="message" required rows={5} placeholder="Nhập chi tiết nội dung cần hỗ trợ..." />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
              {loading ? 'Đang gửi...' : (
                <>
                  <Send className="mr-2" size={18} /> Gửi tin nhắn
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});
