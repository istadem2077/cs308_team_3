package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.entity.Category;
import com.cs308_team_3.sabanci_pharmacy.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @InjectMocks private CategoryService categoryService;

    @Test
    void getAllCategories_Success() {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(new Category(), new Category()));
        assertEquals(2, categoryService.getAllCategories().size());
    }

    @Test
    void getCategoryById_Success() {
        Category c = new Category();
        c.setId(5);
        when(categoryRepository.findById(5)).thenReturn(Optional.of(c));

        Category found = categoryService.getCategoryById(5);
        assertEquals(5, found.getId());
    }

    @Test
    void getCategoryById_NotFound() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> categoryService.getCategoryById(99));
    }

    @Test
    void saveCategory_Success() {
        Category c = new Category();
        when(categoryRepository.save(c)).thenReturn(c);
        assertNotNull(categoryService.saveCategory(c));
    }
}