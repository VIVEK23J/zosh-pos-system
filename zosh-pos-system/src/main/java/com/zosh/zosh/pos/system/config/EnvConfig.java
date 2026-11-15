package com.zosh.zosh.pos.system.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@Configuration
public class EnvConfig {

    private static final Logger log = LoggerFactory.getLogger(EnvConfig.class);

    static {
        loadDotEnv();
    }

    public static void loadDotEnv() {
        String[] possiblePaths = {
            ".env",
            "zosh-pos-system/.env",
            "../.env"
        };

        File envFile = null;
        for (String path : possiblePaths) {
            File f = new File(path);
            if (f.exists() && f.isFile()) {
                envFile = f;
                break;
            }
        }

        if (envFile == null) {
            log.info("No .env file found; using environment variables and application.properties defaults.");
            return;
        }

        log.info("Loading environment configuration from: {}", envFile.getAbsolutePath());

        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int eqIdx = line.indexOf('=');
                if (eqIdx > 0) {
                    String key = line.substring(0, eqIdx).trim();
                    String value = line.substring(eqIdx + 1).trim();

                    // Strip optional quotes
                    if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.substring(1, value.length() - 1);
                    }

                    // Set system property if not already set in OS environment
                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, value);
                    }
                }
            }
        } catch (IOException e) {
            log.warn("Failed to read .env file: {}", e.getMessage());
        }
    }
}
