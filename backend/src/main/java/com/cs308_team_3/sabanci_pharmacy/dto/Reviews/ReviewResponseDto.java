package com.cs308_team_3.sabanci_pharmacy.dto.Reviews;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponseDto {
    private Integer id;
    private Integer productId;
    private String comment;
    private LocalDateTime createdAt;
    private Integer rating;
    private String userName;

}
