import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "@/lib/rr-compat";
import {
  ShoppingCart,
  Plus,
  Search,
  Trash2,
  Package,
  X,
  Check,
  Users,
  Clock,
} from "lucide-react";

import { addToCart, clearCart } from "../../store/cartSlice";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { Badge } from "../common/Badge";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CustomerSelector from "./CustomerSelector";
import PaymentSection from "../payment/PaymentSection";
import PaymentSuccess from "../payment/PaymentSuccess";

const defaultProducts = [
  {
    id: 1,
    name: "Wireless ANC Headphones",
    price: 2499,
    category: "Audio",
    sku: "AUD-ANC-01",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "🎧",
  },
  {
    id: 2,
    name: "Smart Fitness Watch Ultra",
    price: 3499,
    category: "Electronics",
    sku: "ELC-SW-02",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "⌚",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 1299,
    category: "Audio",
    sku: "AUD-BTS-03",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "🔊",
  },
  {
    id: 4,
    name: "RGB Mechanical Keyboard",
    price: 1899,
    category: "Peripherals",
    sku: "PER-KB-04",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "⌨️",
  },
  {
    id: 5,
    name: "Ergonomic Gaming Mouse",
    price: 899,
    category: "Peripherals",
    sku: "PER-MS-05",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "🖱️",
  },
  {
    id: 6,
    name: "Foldable Laptop Stand",
    price: 799,
    category: "Accessories",
    sku: "ACC-LST-06",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "💻",
  },
  {
    id: 7,
    name: "Fast 65W GaN Power Adapter",
    price: 1199,
    category: "Accessories",
    sku: "ACC-CHG-07",
    image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "🔌",
  },
  {
    id: 8,
    name: "True Wireless Earbuds Pro",
    price: 1699,
    category: "Audio",
    sku: "AUD-TWS-08",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=70",
    fallbackIcon: "🎵",
  },
];

function ProductCard({ product, onAdd }) {
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 500);
  };

  const displayCategory = product.categoryName || product.category || "General";
  const displayPrice = Number(product.price != null ? product.price : product.sellingPrice || 0);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Product Image / Icon Area */}
        <div className="aspect-4/3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 flex items-center justify-center relative overflow-hidden mb-3">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <span className="text-3xl">{product.fallbackIcon || "📦"}</span>
          )}

          {/* SKU Pill */}
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 dark:bg-gray-900/90 text-[10px] font-mono font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-2xs">
            {product.sku || `SKU-${product.id}`}
          </span>
        </div>

        {/* Category & Title */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
          {displayCategory}
        </span>
        <h4
          title={product.name}
          className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[32px] mb-2 leading-snug"
        >
          {product.name}
        </h4>
      </div>

      {/* Bottom Price & Add Action */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <strong className="text-sm font-bold font-mono text-emerald-800 dark:text-emerald-400">
          ₹{displayPrice.toFixed(2)}
        </strong>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold text-xs transition ${
            addedAnim
              ? "bg-emerald-900 text-white shadow-2xs scale-95"
              : "bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
          }`}
        >
          {addedAnim ? (
            <>
              <Check className="size-3.5 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function CartSection({ onNavigateToCustomers }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, quantity } = cart;
  const user = useSelector((state) => state.auth.user);
  const currentStore = useSelector((state) => state.auth.currentStore);
  const currentBranch = useSelector((state) => state.auth.currentBranch);
  const storeId = user?.storeId || currentStore?.id || 1;

  const [productsList, setProductsList] = useState(defaultProducts);
  const [categoriesList, setCategoriesList] = useState([
    "All",
    "Audio",
    "Electronics",
    "Peripherals",
    "Accessories",
  ]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getProductsByStore(storeId),
          categoryService.getCategoriesByStore(storeId),
        ]);
        if (Array.isArray(prods) && prods.length > 0) {
          setProductsList(prods);
        }
        if (Array.isArray(cats) && cats.length > 0) {
          const catNames = [
            "All",
            ...cats.map((c) => c.name || c.categoryName).filter(Boolean),
          ];
          setCategoriesList([...new Set(catNames)]);
        }
      } catch (e) {
        console.warn("Backend catalog fallback to defaults", e);
      }
    };
    loadCatalog();
  }, [storeId]);

  const filteredProducts = productsList.filter((product) => {
    const pName = product.name || "";
    const pSku = product.sku || "";
    const pCat = product.categoryName || product.category || "";

    const matchesSearch =
      pName.toLowerCase().includes(search.toLowerCase()) ||
      pSku.toLowerCase().includes(search.toLowerCase()) ||
      pCat.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || pCat.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (completedPayment) {
    return (
      <PaymentSuccess
        payment={completedPayment}
        onNewOrder={() => {
          dispatch(clearCart());
          setCompletedPayment(null);
          setShowPayment(false);
        }}
      />
    );
  }

  if (showPayment) {
    return (
      <PaymentSection
        onBack={() => setShowPayment(false)}
        onComplete={(paymentData) => setCompletedPayment(paymentData)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Action controls - Matches Shift Reports Design System */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Point of Sale (POS) Terminal
            </h1>
            <Badge variant="success">Register Online</Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cashier: <strong>{user?.fullName || "Vivek Sharma"}</strong> • Store:{" "}
            {currentStore?.brand || "Flagship Store"} ({currentBranch?.name || "Main Branch"})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onNavigateToCustomers}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
            title="Open Customer Directory"
          >
            <Users className="size-4" />
            <span>Customer Directory</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/cashier/shifts")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition"
          >
            <Clock className="size-4" />
            <span>Shift Reports</span>
          </button>

          {/* Cart Items Counter Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200">
            <ShoppingCart className="size-4 text-emerald-600" />
            <span>
              {quantity} {quantity === 1 ? "Item" : "Items"} in Cart
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Catalog & Category Selection */}
        <div className="lg:col-span-7 xl:col-span-8 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          {/* Section Heading & Search */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Product Catalog
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select items or scan barcode to add to current order
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-gray-500">
                <Package className="size-3.5 text-emerald-600" />
                <span>{filteredProducts.length} Products</span>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs">
              <Search className="size-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search products by name, category, or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                    category === item
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(p) => dispatch(addToCart(p))}
              />
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-gray-400 space-y-2">
                <Package className="size-10 mx-auto text-gray-300 dark:text-gray-600" />
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  No matching products
                </h4>
                <p>Try searching for a different keyword or change categories.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Info, Cart & Checkout */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5 sticky top-4">
          {/* Customer Selector Section */}
          <CustomerSelector onNavigateToCustomers={onNavigateToCustomers} />

          {/* Cart Items Heading & Clear Action */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Current Cart
              </h3>
              <p className="text-[11px] text-gray-400">
                {quantity} {quantity === 1 ? "unit" : "units"} ({cartItems.length} unique items)
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              disabled={cartItems.length === 0}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="size-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1 divide-y divide-gray-100 dark:divide-gray-800">
            {cartItems.length > 0 ? (
              cartItems.map((item) => <CartItem key={item.id} item={item} />)
            ) : (
              <div className="py-10 text-center text-xs text-gray-400 space-y-2">
                <ShoppingCart className="size-10 mx-auto text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">
                  Your register cart is empty
                </h4>
                <p>Select products from the catalog to build an order.</p>
              </div>
            )}
          </div>

          {/* Order Summary & Checkout Trigger */}
          <CartSummary onProceedToPayment={() => setShowPayment(true)} />
        </div>
      </div>
    </div>
  );
}

export default CartSection;
