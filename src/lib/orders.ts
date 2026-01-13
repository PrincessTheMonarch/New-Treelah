import { supabase } from './supabase';

// Order type definitions
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  product_category: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  personalization: string | null;
  gift_wrap: boolean | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  payment_id: string;
  status: 'processing' | 'in_transit' | 'delivered' | 'canceled';
  subtotal_amount: number;
  delivery_fee: number;
  total_amount: number;
  currency: string;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

// UI-friendly order type (matches mock data structure)
export interface UIOrder {
  id: string;
  orderNumber: string;
  itemName: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Canceled';
  amount: number;
  deliveryFee: number;
  items: {
    name: string;
    type: string;
    price: number;
  }[];
}

// Map database status to UI status
function mapStatusToUI(status: Order['status']): UIOrder['status'] {
  const statusMap: Record<Order['status'], UIOrder['status']> = {
    processing: 'Processing',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    canceled: 'Canceled',
  };
  return statusMap[status] || 'Processing';
}

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Convert database order to UI order format
export function convertToUIOrder(order: Order & { order_items?: OrderItem[] }): UIOrder {
  const mainItem = order.order_items?.[0];
  
  return {
    id: order.order_number, // Use order_number as the visible ID
    orderNumber: order.order_number,
    itemName: mainItem?.product_name || 'Order',
    date: formatDate(order.created_at),
    status: mapStatusToUI(order.status),
    amount: Number(order.subtotal_amount),
    deliveryFee: Number(order.delivery_fee),
    items: (order.order_items || []).map((item) => ({
      name: item.product_name,
      type: item.product_category || 'Product',
      price: Number(item.unit_price) * item.quantity,
    })),
  };
}

// Fetch orders for the current user with nested order items
export async function fetchUserOrders(): Promise<UIOrder[]> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[orders] Error fetching orders:', error);
      throw error;
    }

    if (!orders || orders.length === 0) {
      return [];
    }

    // Convert to UI format
    const uiOrders: UIOrder[] = orders.map((order) =>
      convertToUIOrder(order as Order & { order_items: OrderItem[] })
    );

    return uiOrders;
  } catch (error) {
    console.error('[orders] Failed to fetch orders:', error);
    throw error;
  }
}

// Fetch a single order by order number
export async function fetchOrderByNumber(orderNumber: string): Promise<UIOrder | null> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('[orders] Error fetching order:', error);
      throw error;
    }

    if (!orders) {
      return null;
    }

    return convertToUIOrder(orders as Order & { order_items: OrderItem[] });
  } catch (error) {
    console.error('[orders] Failed to fetch order:', error);
    throw error;
  }
}

// Cancel an order (only if status is 'processing')
export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'canceled', updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .eq('status', 'processing'); // Only cancel if still processing

    if (error) {
      console.error('[orders] Error canceling order:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('[orders] Failed to cancel order:', error);
    throw error;
  }
}

// Add items to cart (for persistent cart storage)
export interface CartItemInput {
  productId: number;
  productName: string;
  productCategory?: string;
  unitPrice: number;
  quantity: number;
  personalization?: string;
  giftWrap?: boolean;
}

// Add item to persistent cart
export async function addToCart(item: CartItemInput): Promise<void> {
  try {
    const { error } = await supabase.from('cart_items').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      product_id: item.productId,
      product_name: item.productName,
      product_category: item.productCategory,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      personalization: item.personalization,
      gift_wrap: item.giftWrap,
    });

    if (error) {
      console.error('[orders] Error adding to cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('[orders] Failed to add to cart:', error);
    throw error;
  }
}

// Fetch user's cart items
export interface CartItem {
  id: string;
  user_id: string;
  product_id: number;
  product_name: string;
  product_category: string | null;
  unit_price: number;
  quantity: number;
  personalization: string | null;
  gift_wrap: boolean | null;
  created_at: string;
  updated_at: string;
}

export async function fetchCartItems(): Promise<CartItem[]> {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[orders] Error fetching cart:', error);
      throw error;
    }

    return cartItems || [];
  } catch (error) {
    console.error('[orders] Failed to fetch cart:', error);
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      console.error('[orders] Error removing from cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('[orders] Failed to remove from cart:', error);
    throw error;
  }
}

// Clear all cart items for user
export async function clearCart(): Promise<void> {
  try {
    const { error } = await supabase.from('cart_items').delete();

    if (error) {
      console.error('[orders] Error clearing cart:', error);
      throw error;
    }
  } catch (error) {
    console.error('[orders] Failed to clear cart:', error);
    throw error;
  }
}

// Sync local cart to persistent cart
export async function syncCartToServer(
  localItems: Array<{
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    category: string;
  }>
): Promise<void> {
  try {
    // First clear existing cart
    await clearCart();

    // Then add all local items
    for (const item of localItems) {
      await addToCart({
        productId: item.id,
        productName: item.title,
        productCategory: item.category,
        unitPrice: item.price,
        quantity: item.quantity,
      });
    }
  } catch (error) {
    console.error('[orders] Error syncing cart:', error);
    throw error;
  }
}
