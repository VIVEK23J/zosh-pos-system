package com.zosh.zosh.pos.system.config;

import com.zosh.zosh.pos.system.entity.*;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Checking and seeding database initial data...");

        // Ensure database columns support full enum names without truncation
        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.execute("ALTER TABLE user DROP CHECK user_chk_1");
            } catch (Exception ignored) {}
            try {
                jdbcTemplate.execute("ALTER TABLE orders DROP CHECK orders_chk_1");
            } catch (Exception ignored) {}

            try {
                jdbcTemplate.execute("ALTER TABLE user MODIFY COLUMN role VARCHAR(50) NOT NULL");
                log.info("Successfully adjusted user.role column to VARCHAR(50).");
            } catch (Exception e) {
                log.info("Note adjusting user.role column: {}", e.getMessage());
            }

            try {
                jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN payment VARCHAR(50)");
                log.info("Successfully adjusted orders.payment column to VARCHAR(50).");
            } catch (Exception e) {
                log.info("Note adjusting orders.payment column: {}", e.getMessage());
            }

            try {
                jdbcTemplate.execute("UPDATE orders SET payment = 'CASH' WHERE payment IS NULL OR payment = '' OR payment NOT IN ('CASH', 'CARD', 'UPI', 'RAZORPAY')");
                log.info("Sanitized any legacy blank payment types in orders table.");
            } catch (Exception e) {
                log.debug("Note sanitizing orders table: {}", e.getMessage());
            }
        }

        // 1. Seed Store
        Store store = storeRepository.findAll().stream().findFirst().orElse(null);
        if (store == null) {
            store = Store.builder()
                    .brand("Zosh Retail Store")
                    .description("Flagship Retail & Electronics Store")
                    .storeStatus(StoreStatus.ACTIVE)
                    .createdDate(LocalDateTime.now())
                    .build();
            store = storeRepository.save(store);
            log.info("Created initial Store: {}", store.getBrand());
        }

        // 2. Seed Branch
        Branch branch = branchRepository.findAll().stream().findFirst().orElse(null);
        if (branch == null) {
            branch = Branch.builder()
                    .name("Main Branch - Sector 29")
                    .address("DLF Cyber City, Sector 29, Gurugram, Haryana")
                    .phone("0124-4598200")
                    .store(store)
                    .createdAt(LocalDateTime.now())
                    .build();
            branch = branchRepository.save(branch);
            log.info("Created initial Branch: {}", branch.getName());
        }

        // 3. Seed Users
        seedUser("cashier@zoshpos.com", "Vivek Sharma (Cashier)", "9876543210", UserRoles.ROLE_CASHIER, store, branch);
        seedUser("manager@zoshpos.com", "Rohit Verma (Manager)", "9876543212", UserRoles.ROLE_MANAGER, store, branch);
        seedUser("storeadmin@zoshpos.com", "Store Admin", "9876543213", UserRoles.ROLE_STORE_ADMIN, store, null);
        seedUser("admin@zoshpos.com", "Super Admin", "9876543214", UserRoles.ROLE_SUPER_ADMIN, null, null);

        // 4. Seed Categories
        Category catAudio = seedCategory("Audio & Sound", store);
        Category catSmart = seedCategory("Smart Devices", store);
        Category catComp = seedCategory("Computer Accessories", store);
        Category catPower = seedCategory("Cables & Power", store);
        Category catOffice = seedCategory("Office & Ergonomics", store);

        // 5. Seed Products
        if (productRepository.count() == 0) {
            seedProduct("Sony WH-1000XM4 Noise Cancelling", "AUD-WH-01", 19999.0, 24990.0, "Sony",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=70",
                    catAudio, store);

            seedProduct("Apple Watch Series 9 GPS 45mm", "WCH-AP-09", 34999.0, 41900.0, "Apple",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=70",
                    catSmart, store);

            seedProduct("Logitech MX Master 3S Wireless Mouse", "ACC-LOG-3S", 7999.0, 9995.0, "Logitech",
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=70",
                    catComp, store);

            seedProduct("Keychron K2 Wireless Mechanical Keyboard", "ACC-KEY-K2", 6899.0, 8499.0, "Keychron",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=70",
                    catComp, store);

            seedProduct("Anker 737 Power Bank 24000mAh", "PWR-ANK-737", 10499.0, 13999.0, "Anker",
                    "https://images.unsplash.com/photo-1609592426868-69335a1a1f0a?w=500&auto=format&fit=crop&q=70",
                    catPower, store);

            seedProduct("Dell UltraSharp 27 4K Monitor", "MON-DEL-27", 42999.0, 52000.0, "Dell",
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=70",
                    catComp, store);

            seedProduct("ErgoPlus Ergonomic Laptop Stand", "OFF-ERG-01", 1899.0, 2499.0, "ErgoPlus",
                    "https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=500&auto=format&fit=crop&q=70",
                    catOffice, store);

            seedProduct("SanDisk Extreme PRO 1TB Portable SSD", "STR-SAN-1T", 11999.0, 15499.0, "SanDisk",
                    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=70",
                    catComp, store);

            log.info("Seeded initial product catalog in database.");
        }

        // 6. Seed Customers
        if (customerRepository.count() == 0) {
            seedCustomer("Rahul Sharma", "rahul.sharma@example.com", "9876543211");
            seedCustomer("Priya Verma", "priya.verma@example.com", "9812345678");
            seedCustomer("Amit Patel", "amit.patel@example.com", "9988776655");
            log.info("Seeded initial customers in database.");
        }

        log.info("Database seeding completed successfully.");
    }

    private void seedUser(String email, String name, String phone, UserRoles role, Store store, Branch branch) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setPhone(phone);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRole(role);
            user.setStore(store);
            user.setBranch(branch);
            user.setCreated_at(LocalDateTime.now());
            userRepository.save(user);
            log.info("Seeded User account: {} ({})", email, role);
        } else {
            boolean modified = false;
            if (user.getStore() == null && store != null) {
                user.setStore(store);
                modified = true;
            }
            if (user.getBranch() == null && branch != null) {
                user.setBranch(branch);
                modified = true;
            }
            if (modified) {
                userRepository.save(user);
            }
        }
    }

    private Category seedCategory(String name, Store store) {
        List<Category> existing = categoryRepository.findByStoreId(store.getId());
        for (Category c : existing) {
            if (c.getCategoryName() != null && c.getCategoryName().equalsIgnoreCase(name)) {
                return c;
            }
        }
        Category cat = new Category();
        cat.setCategoryName(name);
        cat.setStore(store);
        return categoryRepository.save(cat);
    }

    private void seedProduct(String name, String sku, Double price, Double mrp, String brand,
                             String image, Category cat, Store store) {
        Product p = Product.builder()
                .name(name)
                .sku(sku)
                .description(name)
                .sellingPrice(price)
                .mrp(mrp)
                .brand(brand)
                .image(image)
                .category(cat)
                .store(store)
                .createdAt(LocalDateTime.now())
                .build();
        productRepository.save(p);
    }

    private void seedCustomer(String name, String email, String phone) {
        Customer c = Customer.builder()
                .fullName(name)
                .email(email)
                .phone(phone)
                .createdAt(LocalDateTime.now())
                .build();
        customerRepository.save(c);
    }
}
