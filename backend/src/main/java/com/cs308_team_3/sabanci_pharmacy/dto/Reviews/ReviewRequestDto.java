package com.cs308_team_3.sabanci_pharmacy.dto.Reviews;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequestDto {
    @NotNull
    private Integer productId;

    @NotNull
    private Integer userId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;
}
