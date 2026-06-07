import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Social e-commerce</h3>
            <h4 className="font-semibold mb-2">Subscribe</h4>
            <p className="text-gray-400 mb-4">Get 10% off your first order</p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-white/30 text-white placeholder:text-white/50 rounded-r-none focus-visible:ring-white/50"
              />
              <Button
                variant="outline"
                size="default"
                className="bg-transparent border-l-0 border-white/30 rounded-l-none hover:bg-white/10"
              >
                <Send size={18} className="text-white" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <p className="text-gray-400 mb-2">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
            <p className="text-gray-400 mb-2">exclusive@gmail.com</p>
            <p className="text-gray-400">+88015-88888-9999</p>
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
            <h3 className="text-xl font-bold mb-4">Quick Link</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Download App</h3>
            <p className="text-gray-400 mb-4 text-sm">Save $5 with App New User Only</p>
            <div className="flex gap-4 mb-4">
              <div className="p-2 rounded">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://en.wikipedia.org/wiki/QR_code"
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
              <div className="space-y-2">
                <div className="bg-black px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-900 transition-colors flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                    alt="Google Play"
                    className="h-8 object-contain"
                  />
                </div>
                <div className="bg-black px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-900 transition-colors flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/512px-Download_on_the_App_Store_Badge.svg.png"
                    alt="App Store"
                    className="h-8 object-contain"
                  />
                </div>
              </div>
            </div>
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
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  )
}

