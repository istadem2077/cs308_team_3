package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import com.cs308_team_3.sabanci_pharmacy.entity.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;

@Service
public class PdfService {

    public ByteArrayInputStream generateInvoice(Order order) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // 2. Customer Details
            Font font = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Order ID: " + order.getId(), font));
            document.add(new Paragraph("Customer: " + order.getUser().getName(), font));
            document.add(new Paragraph("Email: " + order.getUser().getEmail(), font));
            document.add(new Paragraph("Date: " + order.getCreatedAt().toString(), font));
            document.add(Chunk.NEWLINE);

            // 3. Table Setup
            PdfPTable table = new PdfPTable(4); // 4 Columns
            table.setWidthPercentage(100);
            table.setWidths(new int[]{3, 3, 3, 3}); // Relative widths

            // Table Headers
            addTableHeader(table, "Product");
            addTableHeader(table, "Quantity");
            addTableHeader(table, "Unit Price");
            addTableHeader(table, "Total");

            // 4. Table Data
            BigDecimal grandTotal = BigDecimal.ZERO;

            for (OrderItem item : order.getOrderItems()) {
                table.addCell(item.getProduct().getName());
                table.addCell(item.getQuantity().toString());
                table.addCell("$" + item.getUnitPrice());

                BigDecimal total = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
                table.addCell("$" + total);

                grandTotal = grandTotal.add(total);
            }

            document.add(table);

            // 5. Grand Total
            document.add(Chunk.NEWLINE);
            Paragraph totalPara = new Paragraph("Grand Total: $" + grandTotal,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14));
            totalPara.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalPara);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        header.setPhrase(new Phrase(headerTitle));
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(header);
    }
}