package com.cs308_team_3.sabanci_pharmacy.controller;

import com.sabanci.pharmacy.dto.FinancialReportDto;
import com.sabanci.pharmacy.service.SalesManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/sales")
@PreAuthorize("hasRole('SALES_MANAGER')") // Security Check
public class SalesManagerController {

    @Autowired
    private SalesManagerService salesService;

    // 1. Set Discount
    @PostMapping("/discount/{productId}")
    public ResponseEntity<String> setDiscount(
            @PathVariable Integer productId, 
            @RequestParam BigDecimal rate) {
        
        salesService.applyDiscount(productId, rate);
        return ResponseEntity.ok("Discount applied and users notified.");
    }

    // 2. Financial Report (Revenue/Profit)
    @GetMapping("/report")
    public ResponseEntity<FinancialReportDto> getReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        return ResponseEntity.ok(salesService.generateReport(start, end));
    }
    
    // 3. Get Invoices (Orders)
    // You can reuse a general OrderService method here, filtered by date
}
