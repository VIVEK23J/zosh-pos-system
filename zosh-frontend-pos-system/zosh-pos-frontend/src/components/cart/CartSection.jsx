import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Plus,
  Search,
  Trash2,
  Package,
  X,
  Check,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart, clearCart } from "../../store/cartSlice";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
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

const categories = [
  "All",
  "Audio",
  "Electronics",
  "Peripherals",
  "Accessories",
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
    <div className="product-card">
      <div className="product-image" style={{ position: "relative", overflow: "hidden" }}>
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ) : (
          <span style={{ fontSize: "36px" }}>{product.fallbackIcon || "📦"}</span>
        )}
        <span className="product-sku">{product.sku || `SKU-${product.id}`}</span>
      </div>

      <span className="product-category">{displayCategory}</span>
      <h3 title={product.name}>{product.name}</h3>

      <div className="product-bottom">
        <strong>₹{displayPrice.toFixed(2)}</strong>

        <Button variant="ghost"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className={addedAnim ? "product-add is-added" : "product-add"}
        >
          {addedAnim ? <Check size={16} /> : <Plus size={16} />}
          {addedAnim ? "Added" : "Add"}
        </Button>
      </div>
    </div>
  );
}

function CartSection({ onNavigateToCustomers }) {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, quantity } = cart;
  const user = useSelector((state) => state.auth.user);
  const currentStore = useSelector((state) => state.auth.currentStore);
  const storeId = user?.storeId || currentStore?.id || 1;

  const [productsList, setProductsList] = useState(defaultProducts);
  const [categoriesList, setCategoriesList] = useState([
    "All",
    "Audio",
    "Electronics",
    "Peripherals",
    "Accessories",
  ]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showPayment, setShowPayment] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);

  useEffect(() => {
    const loadCatalog = async () => {
      setCatalogLoading(true);
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
      } finally {
        setCatalogLoading(false);
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
    <div className="pos-container">
      <header className="pos-header">
        <div>
          <p className="eyebrow">CASHIER / REGISTER</p><h1>Point of sale</h1>
        </div>

        <div className="header-cart">
          <ShoppingCart size={19} />
          <span>
            {quantity} {quantity === 1 ? "Item" : "Items"} in Cart
          </span>
        </div>
      </header>

      <main className="pos-layout">
        {/* Products Section */}
        <section className="products-section">
          <div className="section-heading">
            <div>
              <h2>Product Catalog</h2>
              <p className="section-subtitle">
                
              </p>
            </div>
            <Package size={20} className="text-muted-foreground" />
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products by name, category or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <Button variant="ghost"
                type="button"
                onClick={() => setSearch("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <div className="category-list">
            {categoriesList.map((item) => (
              <Button variant="ghost"
                key={item}
                type="button"
                className={category === item ? "category active" : "category"}
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(p) => dispatch(addToCart(p))}
              />
            ))}

            {filteredProducts.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "45px 20px",
                  color: "#6b7280",
                }}
              >
                <Package size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
                <h4 style={{ color: "#374151", marginBottom: "4px" }}>
                  No matching products
                </h4>
                <p style={{ fontSize: "13px" }}>
                  Try searching for another keyword or switch category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Cart & Customer Section */}
        <section className="cart-section">
          <CustomerSelector
            onNavigateToCustomers={onNavigateToCustomers}
          />

          <div className="cart-heading">
            <div>
              <h2>Current Cart</h2>
              <p>
                {quantity} {quantity === 1 ? "unit" : "units"} ({cartItems.length} unique products)
              </p>
            </div>

            <Button variant="ghost"
              type="button"
              className="clear-btn"
              onClick={() => dispatch(clearCart())}
              disabled={cartItems.length === 0}
            >
              <Trash2 size={15} />
              Clear Cart
            </Button>
          </div>

          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))
            ) : (
              <div className="empty-cart">
                <ShoppingCart size={48} strokeWidth={1.5} className="text-muted-foreground" />
                <h3>Your cart is empty</h3>
                <p></p>
              </div>
            )}
          </div>

          <CartSummary
            onProceedToPayment={() => setShowPayment(true)}
          />
        </section>
      </main>
    </div>
  );
}

export default CartSection;
