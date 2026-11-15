import { useNavigate } from "react-router-dom";
import CustomerManagement from "../../components/customers/CustomerManagement";

export function Customers() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <CustomerManagement
        onBack={() => navigate("/cashier/pos")}
        onNavigateToPOS={() => navigate("/cashier/pos")}
      />
    </div>
  );
}

export default Customers;
