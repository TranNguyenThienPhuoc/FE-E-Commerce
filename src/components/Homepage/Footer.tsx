import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">zopee</h3>
            <h3 className="text-lg font-bold mb-4 mt-8">Support</h3>
            <p className="text-gray-400 mb-2">123 Đường Nguyễn Huệ, Quận 1</p>
            <p className="text-gray-400 mb-2">Thành phố Hồ Chí Minh, Việt Nam</p>
            <p className="text-gray-400 mb-2">tranp13579@gmail.com</p>
            <p className="text-gray-400">Điện thoại hỗ trợ : 0869759763</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/account" className="hover:text-white transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <a href="/auth/login" className="hover:text-white transition-colors">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/register" className="hover:text-white transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© Copyright zopee 2026. All right reserved</p>
        </div>
      </div>
    </footer>
  )
}
