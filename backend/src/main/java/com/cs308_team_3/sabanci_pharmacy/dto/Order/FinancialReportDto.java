package com.cs308_team_3.sabanci_pharmacy.dto.Product;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FinancialReportDto {
    private BigDecimal revenue;
    private BigDecimal profit;
    private Integer orderCount;
} 
