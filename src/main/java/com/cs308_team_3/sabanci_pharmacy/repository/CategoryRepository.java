package com.cs308_team_3.sabanci_pharmacy.repository;

import com.cs308_team_3.sabanci_pharmacy.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Integer>, JpaSpecificationExecutor<Category> {
}
