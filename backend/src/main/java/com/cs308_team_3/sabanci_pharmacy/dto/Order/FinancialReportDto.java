package com.cs308_team_3.sabanci_pharmacy.dto.Order;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FinancialReportDto {
    private BigDecimal revenue;
    private BigDecimal profit;
    private Integer orderCount;
} 
