import { useNavigate } from "@/lib/rr-compat";
import CartSection from "../../components/cart/CartSection";

export function POS() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <CartSection onNavigateToCustomers={() => navigate("/cashier/customers")} />
    </div>
  );
}

export default POS;
