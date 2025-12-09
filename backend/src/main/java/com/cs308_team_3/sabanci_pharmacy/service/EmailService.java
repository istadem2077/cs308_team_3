package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvoiceEmail(Order order, ByteArrayInputStream pdfStream) {
        try {
            // 1. Create a MIME message
            MimeMessage message = mailSender.createMimeMessage();

            // 2. Use helper for multipart (attachments)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Sabanci Pharmacy - Order Confirmation #" + order.getId());
            helper.setText("Dear " + order.getUser().getName() + ",\n\n" +
                    "Thank you for your order! Please find your invoice attached.\n\n" +
                    "Best regards,\nSabanci Pharmacy Team");

            // 3. Attach the PDF
            // Wrap the stream in InputStreamResource
            InputStreamResource pdfAttachment = new InputStreamResource(pdfStream);
            helper.addAttachment("invoice_" + order.getId() + ".pdf", pdfAttachment);

            // 4. Send
            mailSender.send(message);
            System.out.println("Email sent successfully to " + order.getUser().getEmail());

        } catch (MessagingException e) {
            // Log the error
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}