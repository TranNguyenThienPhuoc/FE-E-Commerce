export const MESSAGES = {
  cart: {
    addedToCart: 'Sản phẩm đã được thêm vào Giỏ hàng',
    removedFromCart: 'Sản phẩm đã được xóa khỏi Giỏ hàng',
    emptyCart: 'Giỏ hàng của bạn đang trống',
  },
  coupon: {
    applied: 'Mã giảm giá đã được áp dụng!',
    invalid: 'Mã giảm giá không hợp lệ',
    saved: 'Bạn đã tiết kiệm',
  },
  checkout: {
    emptyCart: 'Giỏ hàng của bạn đang trống',
    fillRequiredFields: 'Vui lòng điền đầy đủ các trường bắt buộc',
    orderPlaced: 'Đặt hàng thành công!',
  },
} as const

export const VALID_COUPONS: Record<string, number> = {
  'SAVE10': 10,
  'WELCOME': 15,
  'SUMMER20': 20,
} as const
  