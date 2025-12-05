package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.service.PdfService;
import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/{orderId}")
    public ResponseEntity<InputStreamResource> downloadInvoice(@PathVariable Integer orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        ByteArrayInputStream pdf = pdfService.generateInvoice(order);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=invoice_" + orderId + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
}
