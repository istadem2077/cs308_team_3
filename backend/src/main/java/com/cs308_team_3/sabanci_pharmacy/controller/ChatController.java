package com.cs308_team_3.sabanci_pharmacy.controller;

import com.cs308_team_3.sabanci_pharmacy.dto.Support.ChatMessageDto;
import com.cs308_team_3.sabanci_pharmacy.dto.Support.CustomerContextDto;
import com.cs308_team_3.sabanci_pharmacy.entity.ChatSession;
import com.cs308_team_3.sabanci_pharmacy.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // --- REST Endpoints ---

    // 1. Init Session (Called when user opens chat widget)
    @PostMapping("/session/init")
    public ChatSession initSession(@RequestParam(required = false) String email, 
                                   @RequestParam(required = false) String guestId) {
        boolean isRegistered = (email != null && !email.isEmpty());
        return chatService.initiateSession(isRegistered ? email : guestId, isRegistered);
    }

    // 2. Get Context (For Agents to see user details)
    @GetMapping("/context/{email}")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public CustomerContextDto getUserContext(@PathVariable String email) {
        return chatService.getCustomerContext(email);
    }

    // 3. Get Waiting Queue (For Agents)
    @GetMapping("/queue")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public List<ChatSession> getQueue() {
        return chatService.getActiveQueue();
    }
    
    // 4. Claim Session
    @PostMapping("/session/{sessionId}/claim")
    @PreAuthorize("hasAuthority('SUPPORT_AGENT')")
    public void claimSession(@PathVariable String sessionId, @RequestParam String agentEmail) {
        chatService.claimSession(sessionId, agentEmail);
    }

    // --- WebSocket Endpoints ---

    // Sent to /app/chat/{sessionId}/sendMessage
    @MessageMapping("/chat/{sessionId}/sendMessage")
    public void sendMessage(@DestinationVariable String sessionId, @Payload ChatMessageDto chatMessage) {
        chatMessage.setSessionId(sessionId);
        chatService.saveAndSendMessage(sessionId, chatMessage);
    }
}
