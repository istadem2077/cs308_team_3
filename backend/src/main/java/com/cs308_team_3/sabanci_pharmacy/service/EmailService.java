package com.cs308_team_3.sabanci_pharmacy.service;

import com.cs308_team_3.sabanci_pharmacy.entity.Order;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

import java.io.ByteArrayInputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendInvoiceEmail(Order order, byte[] pdfStream) {
        try {
            // 1. Create a MIME message
            MimeMessage message = javaMailSender.createMimeMessage();

            // 2. Use helper for multipart (attachments)
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Sabanci Pharmacy - Order Confirmation #" + order.getId());
            helper.setText("Dear " + order.getUser().getName() + ",\n\n" +
                    "Thank you for your order! Please find your invoice attached.\n\n" +
                    "Best regards,\nSabanci Pharmacy Team");

            // 3. Attach the PDF
            // Wrap the stream in InputStreamResource
            helper.addAttachment("invoice.pdf", new ByteArrayResource(pdfStream));

            // 4. Send
            javaMailSender.send(message);
            System.out.println("Email sent successfully to " + order.getUser().getEmail());

        } catch (MessagingException e) {
            // Log the error
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendDiscountNotification(String toEmail, String productName, double newPrice) {
	SimpleMailMessage message = new SimpleMailMessage();
	message.setTo(toEmail);
	message.setSubject("Price drop alert: " + productName);
	message.setText("Good news! An item in your wishlist, " + productName + ", is now on sale for $" + newPrice + "!");

	mailSender.send(message);
	System.out.println("Email sent to" + toEmail);
    }

    public void sendRefundNotif(String toEmail) {
	SimpleMailMessage message = new SimpleMailMessage();
	message.setTo(toEmail);
	message.setSubject("The price of the order has been refunded!");
	message.setText("Good news! Your order has been refunded!");
	mailSender.send(message);
	System.out.println("Sent to " + toEmail);
    }
}
