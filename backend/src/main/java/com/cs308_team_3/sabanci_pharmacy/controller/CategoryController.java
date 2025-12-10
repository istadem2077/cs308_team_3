package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.entity.Category;
import com.cs308_team_3.sabanci_pharmacy.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // USED BY APP: To list all categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // USED BY APP: To get details of one category
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Integer id) {
        return categoryService.getCategoryById(id);
    }

    // INTERNAL USE: Use Postman to add categories (since there is no Admin Page)
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    // INTERNAL USE: Use Postman to delete categories
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
    }
}