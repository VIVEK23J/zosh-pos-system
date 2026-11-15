package com.zosh.zosh.pos.system;

import com.zosh.zosh.pos.system.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ZoshPosSystemApplication {

	public static void main(String[] args) {
		EnvConfig.loadDotEnv();
		SpringApplication.run(ZoshPosSystemApplication.class, args);
	}

}
