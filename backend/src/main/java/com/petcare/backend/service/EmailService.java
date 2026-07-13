package com.petcare.backend.service;

import com.petcare.backend.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user, String token) throws MessagingException {
        // Points to the React frontend route which will extract the token and call the backend API
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String displayName = user.getEmail().split("@")[0];

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(user.getEmail());
        helper.setSubject("✅ SmartPetCare — Your Verification Code: " + token);

        String html = "<!DOCTYPE html><html><body>"
                + "<div style='font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:32px;"
                + "background:#f0f9ff;border-radius:16px;'>"
                + "<div style='text-align:center;margin-bottom:24px;'>"
                + "<span style='font-size:40px;'>🐾</span>"
                + "<h2 style='color:#1e293b;margin:8px 0 4px;'>Welcome to SmartPetCare!</h2>"
                + "<p style='color:#64748b;margin:0;'>Hi <strong>" + displayName + "</strong>,</p>"
                + "<p style='color:#64748b;margin:4px 0 0;'>Use the 6-digit verification code (OTP) below to activate your account:</p>"
                + "</div>"
                + "<div style='text-align:center;margin:24px 0;'>"
                + "<div style='display:inline-block;font-size:32px;font-weight:800;color:#6366f1;"
                + "letter-spacing:6px;background:#e0e7ff;padding:16px 40px;border-radius:16px;"
                + "border:2px dashed #818cf8;'>" + token + "</div>"
                + "</div>"
                + "<div style='text-align:center;margin:32px 0;'>"
                + "<p style='color:#64748b;font-size:14px;margin:0 0 12px;'>Or click the button below to verify automatically:</p>"
                + "<a href='" + verificationUrl + "' "
                + "style='display:inline-block;background:linear-gradient(135deg,#6366f1,#14b8a6);"
                + "color:#fff;font-weight:700;font-size:16px;padding:14px 36px;"
                + "border-radius:12px;text-decoration:none;'>"
                + "✅ Verify Email Address</a>"
                + "</div>"
                + "<p style='color:#94a3b8;font-size:13px;text-align:center;margin-top:16px;'>"
                + "This code/link expires in 24 hours.<br>If you did not register, please ignore this email.</p>"
                + "<p style='color:#cbd5e1;font-size:11px;text-align:center;margin-top:24px;'>"
                + "© 2026 SmartPetCare Platform</p>"
                + "</div></body></html>";

        helper.setText(html, true);
        mailSender.send(message);

        System.out.println("✅ Verification email sent to: " + user.getEmail());
        System.out.println("🔗 Direct verify URL: " + verificationUrl);
    }
}
